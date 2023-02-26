const { ethers } = require("hardhat")

async function UniswapV2() {
    const { deployer } = await getNamedAccounts()
     const WethAdd = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
     const DaiAdd = "0x6b175474e89094c44da98b954eedeac495271d0f"
    const inputAmt = "1000000000000000000"

    const sellPrice = await getSellPrice(deployer, inputAmt)
    console.log(
        `Uniswap: 1 WETH gives ${ethers.utils.formatEther(sellPrice)} DAI.`
    )
    return sellPrice
}

async function getSellPrice(account, inputAmt) {
    const uniV2Pair = await ethers.getContractAt(
        "IUniswapV2Pair",
        "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
        account
    )
    const { reserve0, reserve1 } = await uniV2Pair.getReserves()
    const uniRouter02 = await ethers.getContractAt(
        "IUniswapV2Router02",
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        account
    )
    const sellPrice = await uniRouter02.getAmountIn(
        inputAmt,
        reserve0,
        reserve1
    )

    return sellPrice
}
module.exports = { UniswapV2 }
