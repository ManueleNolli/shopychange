// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


interface IMarketplaceCleanable {

    event MarketplaceStorageCleaned(uint256 cleaned);
    event MarketplaceInequalitiesCleaned(uint256 cleaned);

    function cleanStorage() external;
    function cleanInequalities() external;
}
