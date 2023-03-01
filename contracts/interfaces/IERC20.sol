// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    // Returns the amount of tokens that an owner has approved for a spender to spend on their behalf
    function allowance(address owner, address spender) external view returns (uint256 remaining);

    // Allows a spender to spend a specified value of tokens on behalf of the msg.sender
    function approve(address spender, uint256 value) external returns (bool success);

    // Returns the token balance of a specified owner
    function balanceOf(address owner) external view returns (uint256 balance);

    // Returns the number of decimal places used by the token
    function decimals() external view returns (uint8 decimalPlaces);

    // Decreases the amount of tokens that a spender is allowed to spend on behalf of the msg.sender
    function decreaseApproval(address spender, uint256 addedValue) external returns (bool success);

    // Increases the amount of tokens that a spender is allowed to spend on behalf of the msg.sender
    function increaseApproval(address spender, uint256 subtractedValue) external;

    // Returns the name of the token
    function name() external view returns (string memory tokenName);

    // Returns the symbol of the token
    function symbol() external view returns (string memory tokenSymbol);

    // Returns the total number of tokens in circulation
    function totalSupply() external view returns (uint256 totalTokensIssued);

    // Transfers value amount of tokens to the specified to address
    function transfer(address to, uint256 value) external returns (bool success);

    // Transfers value amount of tokens from one address (from) to another (to) if the msg.sender has been authorized to spend on behalf of from
    function transferFrom(address from, address to, uint256 value) external returns (bool success);
}
