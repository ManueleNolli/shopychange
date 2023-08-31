// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


interface IMarketplaceModifiable {

    event SalePriceModified(address indexed contractAddress, uint256 indexed tokenId, address seller, uint256 previousPrice,  uint256 price);

    function modifySalePrice(address _contractAddress, uint256 _tokenId, uint256 _price) external;
}