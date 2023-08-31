// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./MarketplaceFundamental.sol";
import "./interfaces/IMarketplaceRoyaltyApplicable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";

contract MarketplaceRoyaltyApplicable is IMarketplaceRoyaltyApplicable, MarketplaceFundamental {

    /*
    OVERRIDE
    */
    function payShares(Sale memory _sale, uint256 _price) internal virtual override returns(uint256) {
        //contact ERC2981 to get royalty info
        
        // check if contract is ERC2981
        bool isIERC2981 = IERC165(_sale.contractAddress).supportsInterface(type(IERC2981).interfaceId);
        if (!isIERC2981) {
            return _price;
        }

        IERC2981 _royaltyReceiver = IERC2981(_sale.contractAddress);
        (address _royaltyReceiverAddress, uint256 _royaltyAmount) = _royaltyReceiver.royaltyInfo(_sale.tokenId, _price);
        uint256 _sellerShare = _price - _royaltyAmount;

        //pay royalty
        if(_royaltyAmount > 0){
            payable(_royaltyReceiverAddress).transfer(_royaltyAmount);
        }

        return _sellerShare;
    }
}