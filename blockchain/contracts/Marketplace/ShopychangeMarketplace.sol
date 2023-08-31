// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./MarketplaceFundamental.sol";
import "./MarketplaceModifiable.sol";
import "./MarketplaceCancellable.sol";
import "./MarketplaceCleanable.sol";
import "./MarketplaceEarnable.sol";
import "./MarketplaceRoyaltyApplicable.sol";


contract ShopychangeMarketplace is MarketplaceFundamental, MarketplaceModifiable, MarketplaceCancellable, MarketplaceCleanable, MarketplaceEarnable, MarketplaceRoyaltyApplicable {
    constructor(uint16 _royalty) MarketplaceEarnable(_royalty) {
    }

    // use payShares method of MarketplaceEarnable   
    function payShares(Sale memory _sale, uint256 _price) internal override(MarketplaceFundamental, MarketplaceEarnable, MarketplaceRoyaltyApplicable) returns(uint256 sellerShare) {
        uint256 remainValue = MarketplaceEarnable.payShares(_sale, _price);
        return MarketplaceRoyaltyApplicable.payShares(_sale, remainValue);
    }
}