// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./interfaces/IMarketplaceFundamental.sol";

pragma solidity ^0.8.18;

enum Status {NONE, CANCELLED, SOLD, LISTED}

contract MarketplaceFundamental is IMarketplaceFundamental, Context {

    struct Sale {
        address contractAddress;
        address payable seller;
        uint256 tokenId;
        uint256 price;
        Status status;
    }

    mapping(bytes32 => Sale) internal _sales;
    bytes32[] internal _saleIds;

    modifier onlySeller(address _contractAddress, uint256 _tokenId) {
        bytes32 key = getKey(_contractAddress, _tokenId);
        require(_sales[key].seller == _msgSender(), "Only seller can call this function");
        _;
    }

    function getKey(address _contractAddress, uint256 _tokenId) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_contractAddress, _tokenId));
    }

    function createSale(address _contractAddress, uint256 _tokenId, uint256 _price) external override {
        require(_price > 0, "Price must be greater than zero");

        bytes32 saleId = getKey(_contractAddress, _tokenId);
        require(_sales[saleId].status != Status.LISTED, "Token is already for sale");
        
        IERC721 nftContract = IERC721(_contractAddress);
        require(nftContract.getApproved(_tokenId) == address(this) || nftContract.isApprovedForAll(_msgSender(), address(this)), "Shopychange is not approved to manage this token");

        require(nftContract.ownerOf(_tokenId) == _msgSender(), "You are not the owner of this token");

        if(_sales[saleId].status == Status.NONE) {
            _saleIds.push(saleId); //First time that the sale is created for this token
        }
        _sales[saleId] = Sale(_contractAddress, payable(_msgSender()), _tokenId, _price, Status.LISTED);

        emit SaleCreated(_contractAddress, _tokenId, _msgSender(), _price);
    }

    // All shares are paid to the seller
    function payShares(Sale memory _sale, uint256 _price) internal virtual returns(uint256 sellerShare) {
        return _price;
    }

    function buy(address _contractAddress, uint256 _tokenId) external payable override  {
        bytes32 key = getKey(_contractAddress, _tokenId);
        Sale storage sale = _sales[key];

        require(sale.seller != address(0), "Sale does not exist");
        require(sale.status == Status.LISTED, "Token is not for sale");
        require(_msgSender() != sale.seller, "You cannot buy your own NFT");
        
        IERC721 nftContract = IERC721(sale.contractAddress);

        require(sale.seller == nftContract.ownerOf(sale.tokenId), "Seller is no longer the owner of the token");
        require(msg.value == sale.price, "Price is not equal to the sale price");

        nftContract.safeTransferFrom(sale.seller, _msgSender(), sale.tokenId);
        uint256 sellerShare = payShares(sale, sale.price);
        sale.seller.transfer(sellerShare);

        sale.status = Status.SOLD;

        emit SaleBought(sale.contractAddress, sale.tokenId, sale.seller, _msgSender(), sale.price);
    }

    function isTokenForSale(address _contractAddress, uint256 _tokenId) external view returns (bool) {
        bytes32 key = getKey(_contractAddress, _tokenId);
        Sale storage sale = _sales[key];
        return sale.status == Status.LISTED;
    }

    function getSales(bytes32[] memory _keys) internal view returns (Sale[] memory) {
        Sale[] memory salesArray = new Sale[](_keys.length);
        for (uint i = 0; i < _keys.length; i++) {
            salesArray[i] = _sales[_keys[i]];
        }
        return salesArray;
    }

    function getSales() external view returns (Sale[] memory) {
        return getSales(_saleIds);
    }

    function getSale(address _contractAddress, uint256 _tokenId) external view returns (Sale memory) {
        bytes32 _key = getKey(_contractAddress, _tokenId);
        return _sales[_key];
    }
}