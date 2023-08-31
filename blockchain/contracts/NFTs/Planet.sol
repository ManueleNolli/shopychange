// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract Planet is ERC721, Ownable {
    using Strings for uint256;

    string private _baseURIExtended;

    constructor (string memory baseURI) ERC721("Planet", "PLA") {
        _baseURIExtended = baseURI;
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIExtended;
    }

}