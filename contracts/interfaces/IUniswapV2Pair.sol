// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Define an interface for the UniswapV2Pair contract
interface IUniswapV2Pair {

    // Declare two events: Approval and Transfer
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    // Declare functions to get the name, symbol, and decimal places of the token
    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);

    // Declare functions to get the total supply and balance of a given address
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);

    // Declare a function to check the amount of tokens a spender is allowed to spend on behalf of an owner
    function allowance(address owner, address spender) external view returns (uint256);

    // Declare a function to approve a spender to spend a given amount of tokens on behalf of the owner
    function approve(address spender, uint256 value) external returns (bool);

    // Declare a function to transfer tokens from the sender's address to the recipient's address
    function transfer(address to, uint256 value) external returns (bool);

    // Declare a function to transfer tokens from a given address to another address
    function transferFrom(address from, address to, uint256 value) external returns (bool);

    // Declare a function to get the domain separator
    function DOMAIN_SEPARATOR() external view returns (bytes32);

    // Declare a function to get the type hash for permit function
    function PERMIT_TYPEHASH() external pure returns (bytes32);

    // Declare a function to get the nonce of an address
    function nonces(address owner) external view returns (uint256);

    // Declare a function to permit a spender to spend a given amount of tokens on behalf of the owner
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    // Declare three events: Mint, Burn, and Swap
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to);
    event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to);

    // Declare an event: Sync
    event Sync(uint112 reserve0, uint112 reserve1);

    // Declare a function to get the minimum liquidity
    function MINIMUM_LIQUIDITY() external pure returns (uint256);

    // Declare functions to get the factory, token0, and token1 addresses
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);

    // Declare a function to get the reserves of token0 and token1
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);

    // Declare functions to get the cumulative prices of token0 and token1
    function price0CumulativeLast() external view returns (uint256);
    function price1CumulativeLast() external view returns (uint256);

    // Declare a function to get the value of kLast

    function kLast() external view returns (uint256);

    function mint(address to) external returns (uint256 liquidity);

    function burn(address to)
        external
        returns (uint256 amount0, uint256 amount1);

    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes calldata data
    ) external;

    function skim(address to) external;

    function sync() external;

    function initialize(address, address) external;
}
