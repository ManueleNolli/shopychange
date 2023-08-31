// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IERC721EnforceRoyalty.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/* 
    * @title EnforcedRoyaltyERC721
    * @dev EnforcedRoyaltyERC721 is an ERC721 token with royalty enforcement
    * @use Before transfer, the royalty value must be paid, otherwise the transfer will fail
*/
abstract contract ERC721EnforceRoyalty is IERC721EnforceRoyalty, ERC721  {

    struct Sale {

        // price of the NFT
        uint256 price; // wei value

        // Royalty received for each NFT
        // value must be equal _tokenPrice * _royaltyFraction / 10000 to be transferred
        uint256 royaltyValueReceived; // wei value

        // Royalty fraction for each NFT
        uint96 royaltyFraction; // basis points = 100% = 10000 and 0.01% = 1

        // Royalty receiver for each NFT
        address royaltyReceiver;
    }

    mapping(uint256 => Sale) private _sale;

    receive() external payable {}


    function setTokenPrice(uint256 _tokenId, uint256 _price) public {
        require(_exists(_tokenId), "EnforcedRoyaltyERC721: operator query for nonexistent token");
        require(_ownerOf(_tokenId) == msg.sender, "EnforcedRoyaltyERC721: operator query for nonexistent token");
        _sale[_tokenId].price = _price;
    }

    function getTokenPrice(uint256 _tokenId) public view returns (uint256) {
        require(_exists(_tokenId), "EnforcedRoyaltyERC721: operator query for nonexistent token");
        return _sale[_tokenId].price;
    }

    function setTokenRoyalty(uint256 _tokenId, address _royaltyReceiver, uint96 _royaltyFraction) public {
        require(_exists(_tokenId), "EnforcedRoyaltyERC721: operator query for nonexistent token");
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "EnforcedRoyaltyERC721: transfer caller is not owner nor approved");
        _sale[_tokenId].royaltyReceiver = _royaltyReceiver;
        _sale[_tokenId].royaltyFraction = _royaltyFraction;
    }

    function getSaleInfo(uint256 _tokenId) external view returns (uint256, uint256, uint96, address) {
        require(_exists(_tokenId), "EnforcedRoyaltyERC721: operator query for nonexistent token");
        return (_sale[_tokenId].price, _sale[_tokenId].royaltyValueReceived, _sale[_tokenId].royaltyFraction, _sale[_tokenId].royaltyReceiver);
    }

    function payRoyalty(uint256 _tokenId) public payable {
        require(_exists(_tokenId), "EnforcedRoyaltyERC721: operator query for nonexistent token");

        // store the value to the contract
        payable(address(this)).transfer(msg.value);

        // increase the royalty value received
        _sale[_tokenId].royaltyValueReceived += msg.value;

        emit RoyaltyAmountIncreased(_tokenId, msg.value, msg.sender);
    }

    function _transfer(address from, address to, uint256 tokenId) internal virtual override {
        require(_exists(tokenId), "EnforcedRoyaltyERC721: operator query for nonexistent token");
        require(_sale[tokenId].royaltyValueReceived >= _sale[tokenId].price * _sale[tokenId].royaltyFraction / 10000, "EnforcedRoyaltyERC721: Must pay the royalty value before transfer");

        super._transfer(from, to, tokenId);

        // transfer the royalty value to the royalty receiver
        payable(_sale[tokenId].royaltyReceiver).transfer(_sale[tokenId].royaltyValueReceived);

        // reset the royalty value received
        _sale[tokenId].royaltyValueReceived = 0;
    }    

}
