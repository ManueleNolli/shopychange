// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


interface IMarketplaceEarnable {

    event MarketplaceWithdraw();
    event MarketplaceWithdrawTo(address indexed _to);
    event MarketplaceWithdrawToAmount(address indexed _to, uint256 _amount);

    function withdraw() external;
    function withdrawTo(address _to) external;
    function withdrawToAmount(address _to, uint256 _amount) external;
    function getRoyaltyForSale(uint256 salePrice) external returns (uint256);
    function setMarketplaceRoyalty(uint16) external;
    function getMarketplaceRoyalty() external view returns (uint16);
}
