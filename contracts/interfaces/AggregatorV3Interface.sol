// SPDX-License-Identifier: MIT
// Specify the license under which the code is released
pragma solidity ^0.8.0;
// Specify the version of Solidity that the code is written in

// Define an interface for an oracle contract that provides price data for an asset
interface AggregatorV3Interface {
    // This function returns the number of decimal places that the price of the asset is expressed in
    function decimals() external view returns (uint8);

    // This function returns a string that describes the asset whose price is being reported
    function description() external view returns (string memory);

    // This function returns a number that represents the version of the contract that is currently deployed on the blockchain
    function version() external view returns (uint256);

    // This function retrieves data about a specific round of price data
    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    // This function retrieves data about the most recent round of price data
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}
