require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("hardhat-contract-sizer")

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
let historicalBlock = 13292066

module.exports = {
    solidity: {
        compilers: [
            { version: "0.8.2" },
            { version: "0.6.2" },
            { version: "0.6.0" },
            { version: "0.6.12" },
            { version: "0.4.19" },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
                // blockNumber: historicalBlock,
            },
        },
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}
