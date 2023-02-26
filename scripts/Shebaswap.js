const { ethers } = require("hardhat")

async function Shebaswap() {
    const { deployer } = await getNamedAccounts()
    const inputAmt = "1000000000000000000"
    const sellPrice = await getSellPrice(deployer, inputAmt)
    console.log(
        `Shebaswap: 1 WETH gets ${ethers.utils.formatEther(sellPrice)} DAI.`
    )
    return sellPrice
}

async function getSellPrice(account, inputAmt) {
    const ShebaPair = await ethers.getContractAt(
        "IUniswapV2Pair",
        "0x8faf958E36c6970497386118030e6297fFf8d275",
        account
    )
    const { reserve0, reserve1 } = await ShebaPair.getReserves()
    const ShebaRouter = await ethers.getContractAt(
        "IUniswapV2Router02",
        "0x03f7724180AA6b939894B5Ca4314783B0b36b329",
        account
    )
    const sellPrice = (
        await ShebaRouter.getAmountIn(inputAmt, reserve0, reserve1)
    ).toString()

    return sellPrice
}
module.exports = { Shebaswap }
