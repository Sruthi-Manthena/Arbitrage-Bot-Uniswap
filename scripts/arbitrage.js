const { UniswapV2 } = require("./UniswapV2")
const { Sushiswap } = require("../scripts/Sushiswap")
const { Shebaswap } = require("./Shebaswap")
const { Sakeswap } = require("../scripts/Sakeswap")
const { ethers, hre } = require("hardhat")
const { getWETH, AMOUNT } = require("./getWETH")
const WETH_AMOUNT = ethers.utils.formatEther(AMOUNT)
const TOTAL_LOOPS = 30
const loopingEnabled = false
let loopIteration = 0
let cycleProfit = 0
const WethAdd = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const DaiAdd = "0x6b175474e89094c44da98b954eedeac495271d0f"

async function loopTracker() {
    if (loopIteration < TOTAL_LOOPS) {
        loopIteration++
        console.log(`Iteration: ${loopIteration}.`)
        setTimeout(() => {
            findArbitrage()
        }, 10000)
    } else {
        console.log("Scanning Complete.")
        console.log(`Arbitrage made ${cycleProfit} DAI.`)
        process.exit(0)
    }
}

async function getFunds() {
    const { deployer } = await getNamedAccounts()

    await getWETH()
    await getDai(AMOUNT, WETH_AMOUNT, WethAdd, DaiAdd, deployer)
}

async function findArbitrage() {
    const { deployer } = await getNamedAccounts()
    const provider = ethers.getDefaultProvider()

    const oraclePriceUSD = await getOraclePrice()
    let prices = []

    prices.push(
        {
            name: "uni",
            price: (await UniswapV2()).toString(),
            routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            pairAddress: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
        },
        {
            name: "sushi",
            price: (await Sushiswap()).toString(),
            routerAddress: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
            pairAddress: "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f",
        },
        {
            name: "sheba",
            price: (await Shebaswap()).toString(),
            routerAddress: "0x03f7724180AA6b939894B5Ca4314783B0b36b329",
            pairAddress: "0x8faf958E36c6970497386118030e6297fFf8d275",
        },
        {
            name: "sake",
            price: (await Sakeswap()).toString(),
            routerAddress: "0x9C578b573EdE001b95d51a55A3FAfb45f5608b1f",
            pairAddress: "0x2ad95483ac838E2884563aD278e933fba96Bc242",
        }
    )

    //remove unreasonable prices (dead pools && manipulated prices) by comparing DEX prices to "fair" price
    const maxResonable = oraclePriceUSD + oraclePriceUSD * 0.05
    const minResonable = oraclePriceUSD - oraclePriceUSD * 0.05
    for (let i = 0; i < prices.length; i++) {
        if (
            ethers.utils.formatEther(prices[i].price) > maxResonable ||
            ethers.utils.formatEther(prices[i].price) < minResonable
        ) {
            prices.splice(i, 1)
        }
    }

    prices.sort(function (a, b) {
        return a.price - b.price
    })
    let buyPrice = prices[0]
    console.log(buyPrice)

    prices.sort(function (a, b) {
        return b.price - a.price
    })
    let sellPrice = prices[0]
    console.log(sellPrice)

    let revenueUSD =
        (
            ethers.utils.formatEther(sellPrice.price) -
            ethers.utils.formatEther(buyPrice.price)
        ).toString() * WETH_AMOUNT
    const ETHfee = 2 * WETH_AMOUNT * 0.003
    const TOTAL_DEX_FEE = ETHfee * oraclePriceUSD
    const GAS_PRICE = ethers.utils.formatEther(await provider.getGasPrice())
    let gasFees = ("161000" * GAS_PRICE).toString() * "2"
    gasFees = gasFees * oraclePriceUSD
    const profitUSD = revenueUSD - (TOTAL_DEX_FEE + gasFees)

    console.log(
        `Spread: ${
            ethers.utils.formatEther(sellPrice.price) -
            ethers.utils.formatEther(buyPrice.price)
        } DAI.`
    )
    console.log(`Best trade would make about ${profitUSD.toString()} DAI.`)

    if (profitUSD > "0") {
        let gross = await arbitrage(
            WethAdd,
            DaiAdd,
            buyPrice,
            sellPrice,
            deployer
        )
        cycleProfit += gross
        if (loopingEnabled == true) {
            loopTracker()
        }
    } else {
        if (loopingEnabled == true) {
            loopTracker()
        } else {
            console.log("Not preforming trade.")
            console.log(`Arbitrage made ${cycleProfit} DAI.`)
            process.exit(0)
        }
    }
}

async function arbitrage(token0, token1, exchangeBuy, exchangeSell, account) {
    const daiContract = await ethers.getContractAt("IERC20", token1, account)
    const daiAmount = await daiContract.balanceOf(account)
    console.log(
        `You have ${(
            daiAmount / exchangeBuy.price
        ).toString()} ETH worth of DAI.`
    )

    await approveErc20(token0, exchangeBuy.pairAddress, daiAmount, account)
    await approveErc20(token1, exchangeBuy.pairAddress, daiAmount, account)

    await approveErc20(token0, exchangeBuy.routerAddress, daiAmount, account)
    await approveErc20(token1, exchangeBuy.routerAddress, daiAmount, account)
    const buyRouter = await ethers.getContractAt(
        "IUniswapV2Router02",
        exchangeBuy.routerAddress,
        account
    )

    const pair1 = []
    pair1.push(token1, token0)
    const buyTx =
        await buyRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            daiAmount,
            ethers.utils.parseEther(
                (daiAmount / exchangeBuy.price / 1.05).toString()
            ),
            pair1,
            account,
            Date.now() + 300000
        )
    await buyTx.wait(1)
    console.log("Swapped DAI for WETH!")
    const wethContract = await ethers.getContractAt("IWeth", token0, account)
    const wethBalance = await wethContract.balanceOf(account)
    console.log(`You have ${ethers.utils.formatEther(wethBalance)} WETH.`)

    await approveErc20(token0, exchangeSell.pairAddress, wethBalance, account)
    await approveErc20(token1, exchangeSell.pairAddress, wethBalance, account)

   
    await approveErc20(token0, exchangeSell.routerAddress, wethBalance, account)
    await approveErc20(token1, exchangeSell.routerAddress, wethBalance, account)

    const sellRouter = await ethers.getContractAt(
        "IUniswapV2Router02",
        exchangeSell.routerAddress,
        account
    )

    const pair2 = []
    pair2.push(token0, token1)
    const sellTx =
        await sellRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            wethBalance,
            ethers.utils.parseEther(
                (ethers.utils.formatEther(wethBalance) / 1.05).toString()
            ),
            pair2,
            account,
            Date.now() + 300000
        )
    await sellTx.wait(1)
    console.log("Swapped WETH for DAI!")

    const finalDaiBal = await daiContract.balanceOf(account)
    let gross =
        ethers.utils.formatEther(finalDaiBal) -
        ethers.utils.formatEther(daiAmount)
    if (gross > "0") {
        console.log(`Arbitrage made ${gross} DAI!`)
        return gross
    } else {
        console.log(`Lost ${gross} DAI from arbitrage.`)
        return gross
    }
}

async function getDai(amount, daiAmount, token0, token1, account) {
    await approveErc20(
        token0,
        "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
        amount,
        account
    )
    await approveErc20(
        token1,
        "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
        amount,
        account
    )

    await approveErc20(
        token0,
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        amount,
        account
    )
    await approveErc20(
        token1,
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        amount,
        account
    )

    const uniRouter02 = await ethers.getContractAt(
        "IUniswapV2Router02",
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        account
    )
    const pair = []

    pair.push(token0, token1) 
    const swapTx =
        await uniRouter02.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amount,
            ethers.utils.parseEther((daiAmount / 1.004).toString()),
            pair,
            account,
            Date.now() + 300000
        )
    await swapTx.wait(1)
    console.log(`Swapped ${ethers.utils.formatEther(amount)} WETH for DAI!`)
}

async function approveErc20(
    erc20Address,
    spenderAddress,
    amountToSpend,
    account
) {
    const erc20Token = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        account
    )
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved!")
}

async function getOraclePrice() {
    const EthPrice = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
    )
    const price = (await EthPrice.latestRoundData())[1]
    console.log(`The ETH price is ${price.toString() / 100000000} USD`)
    return price / 100000000
}

async function main() {
    console.log("Starting V1.0.0 WETH/DAI Arbitrage")
    await getFunds()
    findArbitrage()
}
main()
