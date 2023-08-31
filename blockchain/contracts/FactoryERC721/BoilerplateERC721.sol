// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../RevenueShare/ERC2981MultiReceiver.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

/* 
    Used ERC721URIStorage because it has the _setTokenURI function that allows to set the tokenURI for each NFT
    in case of adding more NFTs in the future
*/

contract BoilerplateERC721 is Ownable, ERC2981MultiReceiver, ERC721URIStorage, ERC721Burnable  {
    using Counters for Counters.Counter;
    // Counter for token ID
    Counters.Counter private _tokenIdCounter;

    constructor(string memory _name, string memory _symbol, address[] memory _royaltyReceiver, uint96[] memory _royaltyFraction) ERC721(_name, _symbol) ERC2981MultiReceiver(_royaltyReceiver, _royaltyFraction) {
    }

    function mintWithRoyalties(address _to, string memory _tokenURI, address[] memory _royaltyReceiver, uint96[] memory _royaltyFraction) public onlyOwner returns (uint256) {
        uint256 newTokenId = _tokenIdCounter.current();

        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        setTokenRoyalty(newTokenId, _royaltyReceiver, _royaltyFraction);
        _tokenIdCounter.increment();

        return newTokenId;
    }

    function mint(address _to, string memory _tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = _tokenIdCounter.current();

        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        _tokenIdCounter.increment();

        return newTokenId;
    }

    function tokenURI(uint256 _tokenId) public view virtual override (ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(_tokenId);
    }

    function _burn(uint256 _tokenId) internal virtual override (ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage, ERC2981MultiReceiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}