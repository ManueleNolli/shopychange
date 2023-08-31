// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./MarketplaceFundamental.sol";
import "./interfaces/IMarketplaceCleanable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceCleanable is MarketplaceFundamental, IMarketplaceCleanable, Ownable {

    function cleanStorage() external onlyOwner {
        uint i = 0;
        uint cleaned = 0;
        while (i < _saleIds.length) {
            bytes32 key = _saleIds[i];
            Sale storage sale = _sales[key];
            if (sale.status == Status.SOLD || sale.status == Status.CANCELLED) {
                _saleIds[i] = _saleIds[_saleIds.length - 1];
                _saleIds.pop();
                delete _sales[key];
                cleaned++;
            } else {
                i++;
            }
        }

        emit MarketplaceStorageCleaned(cleaned);
    }

    // clean if seller is not owner anymore
    function cleanInequalities() external onlyOwner {
        uint i = 0;
        uint cleaned = 0;
        while (i < _saleIds.length) {
            bytes32 key = _saleIds[i];
            Sale storage sale = _sales[key];
            IERC721 nftContract = IERC721(sale.contractAddress);
            if (sale.seller != nftContract.ownerOf(sale.tokenId)) {
                _saleIds[i] = _saleIds[_saleIds.length - 1];
                _saleIds.pop();
                delete _sales[key];
                cleaned++;
            } else {
                i++;
            }
        }
        emit MarketplaceInequalitiesCleaned(cleaned);
    }

}