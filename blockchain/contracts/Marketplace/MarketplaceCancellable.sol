// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./MarketplaceFundamental.sol";
import "./interfaces/IMarketplaceCancellable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceCancellable is MarketplaceFundamental, IMarketplaceCancellable, Ownable {

    modifier onlySellerOrOwner(address _contractAddress, uint256 _tokenId) {
        bytes32 key = getKey(_contractAddress, _tokenId);
        Sale storage sale = _sales[key];
        require(sale.seller == _msgSender() || _msgSender() == owner(), "Only seller or admin can cancel sale");
        _;
    }

    function cancelSale(address _contractAddress, uint256 _tokenId) onlySellerOrOwner(_contractAddress, _tokenId) external override {
        bytes32 key = getKey(_contractAddress, _tokenId);
        Sale storage sale = _sales[key];

        require(sale.seller != address(0), "Sale does not exist");
        require(sale.status == Status.LISTED, "Token is not for sale");

        sale.status = Status.CANCELLED;

        emit SaleCancelled(_contractAddress, _tokenId, _msgSender());
    }
}