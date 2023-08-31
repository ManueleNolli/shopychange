// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract TechnologicalAnimals is ERC721URIStorage, Ownable {

    constructor () ERC721("Technological Animals", "TEA") {}

    function safeMint(address to, uint256 tokenId, string calldata uri)
        public
        onlyOwner
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

}