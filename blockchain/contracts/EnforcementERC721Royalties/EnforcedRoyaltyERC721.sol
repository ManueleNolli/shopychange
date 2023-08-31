// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "./ERC721EnforceRoyalty.sol";

contract EnforcedRoyaltyERC721 is Ownable, ERC721URIStorage, ERC721Burnable, ERC721EnforceRoyalty  {
    using Counters for Counters.Counter;
    // Counter for token ID
    Counters.Counter private _tokenIdCounter;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
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

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721EnforceRoyalty) {
        super._transfer(from, to, tokenId);
    }
}