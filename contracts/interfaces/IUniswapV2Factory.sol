// SPDX-License-Identifier: MIT
// This specifies the license under which this code is released.

pragma solidity ^0.8.0;

// This declares an interface for the UniswapV2Factory contract.
interface IUniswapV2Factory {
    
    // This declares an event that is emitted when a new Uniswap V2 Pair is created.
    // It includes the addresses of the two tokens used to create the pair, the address of the new pair,
    // and a uint256 value that is not used in the event.
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    // This function returns the address of the account that receives the protocol fee on each trade.
    function feeTo() external view returns (address);

    // This function returns the address of the account that has permission to change the fee recipient.
    function feeToSetter() external view returns (address);

    // This function returns the address of the Uniswap V2 Pair that matches the input tokens.
    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);

    // This function returns the address of the Uniswap V2 Pair at the given index in the allPairs array.
    function allPairs(uint256) external view returns (address pair);

    // This function returns the number of Uniswap V2 Pairs that have been created by the UniswapV2Factory contract.
    function allPairsLength() external view returns (uint256);

    // This function creates a new Uniswap V2 Pair for the input tokens and returns the address of the newly created pair.
    function createPair(address tokenA, address tokenB)
        external
        returns (address pair);

    // This function sets the address that receives the protocol fee on each trade.
    function setFeeTo(address) external;

    // This function sets the address that has permission to change the fee recipient.
    function setFeeToSetter(address) external;
}
