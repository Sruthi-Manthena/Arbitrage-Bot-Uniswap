// Import the `getNamedAccounts` function and the `ethers` library from Hardhat
const { getNamedAccounts, ethers } = require("hardhat")

// Define a constant value representing the amount of Ether to deposit (in Wei)
const AMOUNT = ethers.utils.parseEther("1")

// Define an async function called `getWETH`
async function getWETH() {
    // Get the `deployer` account using the `getNamedAccounts` function
    const { deployer } = await getNamedAccounts()

    // Get a reference to the `IWeth` contract at a specified address using `ethers.getContractAt`
    const iWeth = await ethers.getContractAt(
        "IWeth", // The name of the contract's ABI
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // The address of the contract on the network
        deployer // The account to use for interacting with the contract
    )

    // Deposit `AMOUNT` Ether into the `IWeth` contract by calling its `deposit` function
    const tx = await iWeth.deposit({ value: AMOUNT })

    // Wait for the transaction to be mined using the `tx.wait` method
    await tx.wait(1)

    // Get the balance of WETH tokens held by the `deployer` account using the `balanceOf` function
    const wethBalance = await iWeth.balanceOf(deployer)

    // Log a message to the console indicating how much WETH was obtained
    console.log(`Got ${ethers.utils.formatEther(wethBalance)} WETH.`)
}

// Export the `getWETH` function and the `AMOUNT` constant so they can be used in other modules
module.exports = { getWETH, AMOUNT }
