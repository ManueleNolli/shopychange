// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/interfaces/IERC165.sol";

interface IERC2981MultiReceiver is IERC165 {
    function setDefaultRoyalty(address[] memory _royaltyReceiver, uint96[] memory _royaltyFraction) external;
    function deleteDefaultRoyalty() external;
    function setTokenRoyalty(uint256 _tokenId, address[] memory _royaltyReceiver, uint96[] memory _royaltyFraction) external;
    function resetTokenRoyalty(uint256 _tokenId) external;
    function hasPaymentSplitter(uint256 _tokenId) external view returns (bool);
    function hasDefaultPaymentSplitter() external view returns (bool);
    function hasPersonalizedRoyalties(uint256 _tokenId) external view returns (bool);
}
