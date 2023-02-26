const { ethers } = require("hardhat")

async function Sakeswap() {
    const { deployer } = await getNamedAccounts()
    const WethAdd = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const DaiAdd = "0x6b175474e89094c44da98b954eedeac495271d0f"
    const inputAmt = "1000000000000000000"
    const sellPrice = await getSellPrice(deployer, inputAmt)
    console.log(
        `Sakeswap: 1 WETH gets ${ethers.utils.formatEther(sellPrice)} DAI.`
    )
    return sellPrice
}

async function getSellPrice(account, inputAmt) {
    const sakePair = await ethers.getContractAt(
        "IUniswapV2Pair",
        "0x2ad95483ac838E2884563aD278e933fba96Bc242",
        account
    )
    const sellPrice = (
        await sakeRouter.getAmountIn(inputAmt, reserve0, reserve1)
    ).toString()

    return sellPrice
}
module.exports = { Sakeswap }
