// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


interface IMarketplaceFundamental {
    event SaleCreated(address indexed contractAddress, uint256 indexed tokenId, address seller, uint256 price);
    event SaleBought(address indexed contractAddress, uint256 indexed tokenId, address seller, address buyer, uint256 price);

    function createSale(address _contractAddress, uint256 _tokenId, uint256 _price) external;
    function buy(address _contractAddress, uint256 _tokenId) external payable;
}