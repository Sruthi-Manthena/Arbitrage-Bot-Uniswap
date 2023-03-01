// Import the `ethers` module from the `hardhat` package.
const { ethers } = require("hardhat")

// Define an asynchronous function named `Sakeswap`.
async function Sakeswap() {
    // Retrieve the `deployer` account from the `hardhat` environment using `getNamedAccounts()`.
    const { deployer } = await getNamedAccounts()

    // Define the addresses of the WETH and DAI tokens.
    const WethAdd = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const DaiAdd = "0x6b175474e89094c44da98b954eedeac495271d0f"

    // Set the input amount to 1 ETH (in wei).
    const inputAmt = "1000000000000000000"

    // Call the `getSellPrice()` function to get the sell price of 1 WETH in DAI.
    const sellPrice = await getSellPrice(deployer, inputAmt)

    // Log the sell price of 1 WETH in DAI to the console, formatted as an ether value.
    console.log(
        `Sakeswap: 1 WETH gets ${ethers.utils.formatEther(sellPrice)} DAI.`
    )

    // Return the sell price of 1 WETH in DAI.
    return sellPrice
}

// Define an asynchronous function named `getSellPrice` to get the sell price of WETH in DAI.
async function getSellPrice(account, inputAmt) {
    // Retrieve the Sakeswap WETH-DAI pair contract using its address and the `IUniswapV2Pair` interface.
    const sakePair = await ethers.getContractAt(
        "IUniswapV2Pair",
        "0x2ad95483ac838E2884563aD278e933fba96Bc242",
        account
    )

    // Get the reserves of the Sakeswap WETH-DAI pair contract.
    const { reserve0, reserve1 } = await sakePair.getReserves()

    // Retrieve the UniswapV2Router02 contract using its address and the `IUniswapV2Router02` interface.
    const sakeRouter = await ethers.getContractAt(
        "IUniswapV2Router02",
        "0x9C578b573EdE001b95d51a55A3FAfb45f5608b1f",
        account
    )

    // Calculate the sell price of WETH in DAI using `getAmountIn()` function of `sakeRouter`.
    const sellPrice = (
        await sakeRouter.getAmountIn(inputAmt, reserve0, reserve1)
    ).toString()

    // Return the sell price of WETH in DAI.
    return sellPrice
}

// Export the `Sakeswap` function from the module.
module.exports = { Sakeswap }
