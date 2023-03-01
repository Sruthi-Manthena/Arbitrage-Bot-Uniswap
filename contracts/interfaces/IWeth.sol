// This is an interface for the WETH (Wrapped Ether) token.
pragma solidity ^0.8.0

interface IWeth {
    // Returns the amount of WETH tokens that a spender is allowed to spend on behalf of an owner.
    function allowance(address owner, address spender)
        external
        view
        returns (uint256 remaining);

    // Allows a spender to spend a certain amount of WETH tokens on behalf of the owner.
    function approve(address spender, uint256 value)
        external
        returns (bool success);

    // Returns the balance of WETH tokens that an owner holds.
    function balanceOf(address owner) external view returns (uint256 balance);

    // Returns the number of decimal places that WETH tokens use.
    function decimals() external view returns (uint8 decimalPlaces);

    // Returns the name of the WETH token.
    function name() external view returns (string memory tokenName);

    // Returns the symbol of the WETH token.
    function symbol() external view returns (string memory tokenSymbol);

    // Returns the total supply of WETH tokens that have been issued.
    function totalSupply() external view returns (uint256 totalTokensIssued);

    // Transfers a certain amount of WETH tokens from the sender's account to the recipient's account.
    function transfer(address to, uint256 value)
        external
        returns (bool success);

    // Transfers a certain amount of WETH tokens from the owner's account to the recipient's account, on behalf of a spender.
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool success);

    // Deposits Ether into the contract and issues the corresponding amount of WETH tokens to the depositor.
    function deposit() external payable;

    // Withdraws a certain amount of WETH tokens from the caller's account and sends the corresponding amount of Ether to the caller's address.
    function withdraw(uint256 wad) external;
}
