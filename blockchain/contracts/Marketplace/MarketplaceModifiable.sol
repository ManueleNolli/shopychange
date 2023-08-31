// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./MarketplaceFundamental.sol";
import "./interfaces/IMarketplaceModifiable.sol";

contract MarketplaceModifiable is MarketplaceFundamental, IMarketplaceModifiable{

    function modifySalePrice(address _contractAddress, uint256 _tokenId, uint256 _price) onlySeller(_contractAddress, _tokenId) external override {
        bytes32 key = getKey(_contractAddress, _tokenId);
        Sale storage sale = _sales[key];

        require(sale.seller != address(0), "Sale does not exist");
        require(sale.status == Status.LISTED, "Token is not for sale");
        require(_price > 0, "Price must be greater than zero");

        uint256 previousPrice = sale.price;

        sale.price = _price;

        emit SalePriceModified(_contractAddress, _tokenId, _msgSender(), previousPrice, _price);
    }
}