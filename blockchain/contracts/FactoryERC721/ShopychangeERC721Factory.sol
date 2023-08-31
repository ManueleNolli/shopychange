// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./BoilerplateERC721.sol";

contract ShopychangeERC721Factory {
    address[] private allContracts;

    event NewERC721(address indexed creator, address indexed erc721, string name, string symbol, string creationBaseURI, uint256 numberOfTokensToMint);

    function createERC721(string memory name, string memory symbol, string memory creationBaseURI, uint256 numberOfTokensToMint, address[] memory _royaltyReceiver, uint96[] memory _royaltyFraction) public returns (address) {
        // create the contract
        BoilerplateERC721 erc721 = new BoilerplateERC721(name, symbol, _royaltyReceiver, _royaltyFraction);

        // mint the start tokens
        for (uint256 i = 0; i < numberOfTokensToMint; i++) {
            erc721.mint(msg.sender, string(abi.encodePacked(creationBaseURI, Strings.toString(i))));
        }
        // transferOwnership to the creator
        erc721.transferOwnership(msg.sender);

        allContracts.push(address(erc721));
        emit NewERC721(msg.sender, address(erc721), name, symbol, creationBaseURI, numberOfTokensToMint);
        return address(erc721);
    }

    function getAllERC721s() public view returns (address[] memory) {
        return allContracts;
    }

}