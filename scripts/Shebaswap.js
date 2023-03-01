// Import the ethers.js library from the Hardhat framework
const { ethers } = require("hardhat");

// Define an asynchronous function that returns the sell price of DAI for 1 WETH using the ShebaSwap protocol
async function Shebaswap() {
    // Get the deployer account from the Hardhat deployment environment
    const { deployer } = await getNamedAccounts();

    // Set the input amount of WETH to 1
    const inputAmt = "1000000000000000000";

    // Get the sell price of DAI for the input amount of WETH using the getSellPrice function
    const sellPrice = await getSellPrice(deployer, inputAmt);

    // Log the sell price of DAI for 1 WETH to the console
    console.log(`Shebaswap: 1 WETH gets ${ethers.utils.formatEther(sellPrice)} DAI.`);

    // Return the sell price of DAI for the input amount of WETH
    return sellPrice;
}

// Define an asynchronous function that gets the sell price of DAI for the input amount of WETH using the ShebaSwap protocol
async function getSellPrice(account, inputAmt) {
    // Get the ShebaSwap pair contract using the getContractAt function
    const ShebaPair = await ethers.getContractAt(
        "IUniswapV2Pair", // The interface name of the contract
        "0x8faf958E36c6970497386118030e6297fFf8d275", // The address of the contract on the blockchain
        account // The account to use to interact with the contract
    );

    // Get the reserves of the ShebaSwap pair contract using the getReserves function
    const { reserve0, reserve1 } = await ShebaPair.getReserves();

    // Get the ShebaSwap router contract using the getContractAt function
    const ShebaRouter = await ethers.getContractAt(
        "IUniswapV2Router02", // The interface name of the contract
        "0x03f7724180AA6b939894B5Ca4314783B0b36b329", // The address of the contract on the blockchain
        account // The account to use to interact with the contract
    );

    // Get the sell price of DAI for the input amount of WETH using the getAmountIn function
    const sellPrice = (await ShebaRouter.getAmountIn(inputAmt, reserve0, reserve1)).toString();

    // Return the sell price of DAI for the input amount of WETH
    return sellPrice;
}

// Export the Shebaswap function
module.exports = { Shebaswap };
