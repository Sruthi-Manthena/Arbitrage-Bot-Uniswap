// Import the ethers.js library and the Hardhat development environment
const { ethers } = require("hardhat")

// Define the Sushiswap function that will retrieve the sell price of 1 WETH in DAI on the Sushiswap exchange
async function Sushiswap() {
    // Retrieve the deployer account from the Hardhat environment
    const { deployer } = await getNamedAccounts()
    // Define the Ethereum addresses of WETH and DAI tokens
    const WethAdd = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const DaiAdd = "0x6b175474e89094c44da98b954eedeac495271d0f"
    // Define the amount of WETH to sell for DAI
    const inputAmt = "1000000000000000000"
    // Call the getSellPrice function to retrieve the sell price of 1 WETH in DAI
    const sellPrice = await getSellPrice(deployer, inputAmt)
    // Print the sell price to the console
    console.log(
        `Sushiswap: 1 WETH gets ${ethers.utils.formatEther(sellPrice)} DAI.`
    )
    // Return the sell price
    return sellPrice
}

// Define the getSellPrice function that will retrieve the sell price of WETH in DAI from the Sushiswap exchange
async function getSellPrice(account, inputAmt) {
    // Retrieve the Sushiswap pair contract for WETH/DAI
    const sushiPair = await ethers.getContractAt(
        "IUniswapV2Pair",
        "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f",
        account
    )
    // Retrieve the reserves of WETH and DAI in the Sushiswap pair
    const { reserve0, reserve1 } = await sushiPair.getReserves()
    // Retrieve the Sushiswap router contract
    const sushiRouter = await ethers.getContractAt(
        "IUniswapV2Router02",
        "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
        account
    )
    // Compute the sell price of WETH in DAI using the Sushiswap router contract
    const sellPrice = (
        await sushiRouter.getAmountIn(inputAmt, reserve0, reserve1)
    ).toString()

    // Return the sell price
    return sellPrice
}

// Export the Sushiswap function as the module's main function
module.exports = { Sushiswap }
