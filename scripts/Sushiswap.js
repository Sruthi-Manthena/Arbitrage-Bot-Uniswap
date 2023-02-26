const { ethers } = require("hardhat")

async function Sushiswap() {
    const { deployer } = await getNamedAccounts()
    const WethAdd = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const DaiAdd = "0x6b175474e89094c44da98b954eedeac495271d0f"
    const inputAmt = "1000000000000000000"
    const sellPrice = await getSellPrice(deployer, inputAmt)
    console.log(
        `Sushiswap: 1 WETH gets ${ethers.utils.formatEther(sellPrice)} DAI.`
    )
    return sellPrice
}

async function getSellPrice(account, inputAmt) {
    const sushiPair = await ethers.getContractAt(
        "IUniswapV2Pair",
        "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f",
        account
    )
    const { reserve0, reserve1 } = await sushiPair.getReserves()
    const sushiRouter = await ethers.getContractAt(
        "IUniswapV2Router02",
        "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
        account
    )
    const sellPrice = (
        await sushiRouter.getAmountIn(inputAmt, reserve0, reserve1)
    ).toString()

    return sellPrice
}
module.exports = { Sushiswap }
