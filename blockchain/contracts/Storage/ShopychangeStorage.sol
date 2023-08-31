// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../RevenueShare/ERC2981MultiReceiver.sol";

/*
    SHOPYCHANGE STORAGE
    for single NFT creation
*/
contract ShopychangeStorage is ERC2981MultiReceiver, ERC721URIStorage {
    using Counters for Counters.Counter;
    // Counter for token ID
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Shopychange Storage", "SHS") ERC2981MultiReceiver(getAddresses(), getValues()) {}

    function getAddresses() private view returns (address[] memory) {
        address[] memory addresses = new address[](1);
        addresses[0] = address(this);
        return addresses;
    }

    function getValues() private pure returns (uint96[] memory) {
        uint96[] memory values = new uint96[](1);
        values[0] = 0;
        return values;
    }

    function mintWithRoyalties(string memory tokenURI, address[] memory _royaltyReceiver, uint96[] memory _royaltyFraction) public returns (uint256) {
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setTokenRoyalty(newItemId, _royaltyReceiver, _royaltyFraction);

        return newItemId;
    }
    
    function mint(string memory tokenURI) public returns (uint256) {
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ShopychangeStorage: caller is not token owner or approved");
        _burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, ERC2981MultiReceiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}
