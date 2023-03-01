// Import the ethers library from the hardhat package
const { ethers } = require("hardhat")

// Define an async function named UniswapV2
async function UniswapV2() {
    // Call the getNamedAccounts() function to obtain the address of the deployer
    const { deployer } = await getNamedAccounts()
   
    // Define Ethereum contract addresses for WETH and DAI
    const WethAdd = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const DaiAdd = "0x6b175474e89094c44da98b954eedeac495271d0f"

    // Define an input amount of 1 ether
    const inputAmt = "1000000000000000000"

    // Call the getSellPrice() function to calculate the amount of DAI that can be obtained by selling 1 WETH on Uniswap
    const sellPrice = await getSellPrice(deployer, inputAmt)

    // Log the result to the console in a human-readable format using the ethers.utils.formatEther() function
    console.log(
        `Uniswap: 1 WETH gives ${ethers.utils.formatEther(sellPrice)} DAI.`
    )

    // Return the sellPrice
    return sellPrice
}

// Define an async function named getSellPrice that takes an Ethereum address of an account and an input amount
async function getSellPrice(account, inputAmt) {
    // Call the getContractAt() function to obtain an instance of the Uniswap V2 pair contract, which represents the WETH-DAI trading pair
    const uniV2Pair = await ethers.getContractAt(
        "IUniswapV2Pair",
        "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
        account
    )

    // Call the getReserves() function on the contract instance to obtain the current reserves of WETH and DAI in the trading pair
    const { reserve0, reserve1 } = await uniV2Pair.getReserves()

    // Call the getContractAt() function again to obtain an instance of the Uniswap V2 router contract, which is used to perform trades on Uniswap
    const uniRouter02 = await ethers.getContractAt(
        "IUniswapV2Router02",
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        account
    )

    // Call the getAmountIn() function on the router contract instance to calculate the amount of WETH that can be obtained by selling the input amount of DAI, using the current reserves of WETH and DAI
    const sellPrice = await uniRouter02.getAmountIn(
        inputAmt,
        reserve0,
        reserve1
    )

    // Return the sellPrice
    return sellPrice
}

// Export the UniswapV2 function
module.exports = { UniswapV2 }
