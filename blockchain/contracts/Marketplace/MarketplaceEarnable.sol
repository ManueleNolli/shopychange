// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./MarketplaceFundamental.sol";
import "./interfaces/IMarketplaceEarnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract MarketplaceEarnable is MarketplaceFundamental, IMarketplaceEarnable, Ownable {
    uint16 private royalty; // basevalue 10000 = 100%, 1000 = 10%, 100 = 1%, 10 = 0.1%, 1 = 0.01%

    constructor(uint16 _royalty) {
        royalty = _royalty;
    }

    // Receive ETH
    receive() external payable {}

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "No balance to withdraw");
        payable(owner()).transfer(address(this).balance);
        emit MarketplaceWithdraw();
    }

    function withdrawTo(address _to) external onlyOwner {
        require(address(this).balance > 0, "No balance to withdraw");
        
        //Check if the _to is not a contract
        require(!isContract(_to), "Can't withdraw to contract");
        
        //Check if the EOA _to can receive ETH
        require(isEOAvalidToReceiveETH(_to), "The address can't receive ETH");

        payable(_to).transfer(address(this).balance);
        emit MarketplaceWithdrawTo(_to);
    }

    function withdrawToAmount(address _to, uint256 _amount) external onlyOwner {
        require(address(this).balance > 0, "No balance to withdraw");
        require(_amount <= address(this).balance, "Amount is bigger than balance");

        //Check if the _to is not a contract
        require(!isContract(_to), "Can't withdraw to contract");
        
        //Check if the EOA _to can receive ETH
        require(isEOAvalidToReceiveETH(_to), "The address can't receive ETH");

        payable(_to).transfer(_amount);
        emit MarketplaceWithdrawToAmount(_to, _amount);
    }


    function getRoyaltyForSale(uint256 salePrice) public view returns (uint256) {
        return (salePrice * royalty) / 10000;
    }


    function setMarketplaceRoyalty(uint16 _royalty) external onlyOwner {
        require(_royalty <= 10000, "Royalty can't be greater than 100%");
        royalty = _royalty;
    }

    function getMarketplaceRoyalty() external view returns (uint16){
        return royalty;
    }

    function isContract(address _addr) internal view returns (bool) {
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(_addr)
        }
        return codeSize > 0;
    }


    function isEOAvalidToReceiveETH(address _addr) internal returns (bool) {
        (bool success, bytes memory returnData) = _addr.call{value: 0, gas: 0}("");
        return success && (returnData.length == 0);
    }

    /*
    OVERRIDE
    */
    function payShares(Sale memory _sale, uint256 _price) internal virtual override returns(uint256) {
        uint256 royaltyAmount = getRoyaltyForSale(_price);
        uint256 sellerAmount = _price - royaltyAmount;

        payable(address(this)).transfer(royaltyAmount);
        return sellerAmount;
    }

}
