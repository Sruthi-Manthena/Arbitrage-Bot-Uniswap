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
    const sellPrice = (
        await ShebaRouter.getAmountIn(inputAmt, reserve0, reserve1)
    ).toString()

    return sellPrice
}
module.exports = { Shebaswap }
