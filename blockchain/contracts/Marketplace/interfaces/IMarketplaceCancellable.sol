// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


interface IMarketplaceCancellable {

    event SaleCancelled(address indexed contractAddress, uint256 indexed tokenId, address seller);

    function cancelSale(address _contractAddress, uint256 _tokenId) external;

}
