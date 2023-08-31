// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @dev Required interface of an ERC721EnforceRoyalty compliant contract.
 */

interface IERC721EnforceRoyalty {

    /**
     * @dev Emitted when `tokenId` amount for royalty is increased (paid).
     */
    event RoyaltyAmountIncreased(uint256 indexed tokenId, uint256 royaltyAmount, address royaltyPayee);

    function setTokenPrice(uint256 _tokenId, uint256 _price) external;
    function getTokenPrice(uint256 _tokenId) external view returns (uint256);
    function setTokenRoyalty(uint256 _tokenId, address _royaltyReceiver, uint96 _royaltyFraction) external;
    function getSaleInfo(uint256 _tokenId) external view returns (uint256, uint256, uint96, address);
    function payRoyalty(uint256 _tokenId) external payable;
}
