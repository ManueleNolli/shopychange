// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import '../ShopychangePaymentSplitter/ShopychangePaymentSplitter.sol';
import './IERC2981MultiReceiver.sol';
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract ERC2981MultiReceiver is Ownable, ERC2981, IERC2981MultiReceiver {
    bytes4 public constant IERC2981MultiReceiver_ID = type(IERC2981MultiReceiver).interfaceId;
    bytes4 public constant IERC2981_ID = type(IERC2981).interfaceId;

    mapping (uint256 => bool) private _hasPaymentSplitter;
    mapping (uint256 => bool) private _hasPersonalizedRoyalties;
    bool private _hasDefaultPaymentSplitter;

    constructor(address[] memory _royaltyReceiver, uint96[] memory _royaltyFraction) {
        setDefaultRoyalty(_royaltyReceiver, _royaltyFraction);
    }
    function setDefaultRoyalty(address[] memory _royaltyReceiver, uint96[] memory _royaltyFraction) public onlyOwner {
        if (_royaltyReceiver.length == 1) {
            _setDefaultRoyalty(_royaltyReceiver[0], _royaltyFraction[0]);
            _hasDefaultPaymentSplitter = false;
        } else if(_royaltyReceiver.length > 1) {
            uint96 _totalFraction = 0;
            for (uint96 i = 0; i < _royaltyReceiver.length; i++) {
                _totalFraction += _royaltyFraction[i];
            }
            // New Payment Splitter
            ShopychangePaymentSplitter _paymentSplitter = new ShopychangePaymentSplitter(
                _royaltyReceiver, _royaltyFraction
            );

            _setDefaultRoyalty(address(_paymentSplitter), _totalFraction);
            _hasDefaultPaymentSplitter = true;
        }
    }

    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
        _hasDefaultPaymentSplitter = false;
    }

    function setTokenRoyalty(uint256 _tokenId, address[] memory _royaltyReceiver, uint96[] memory _royaltyFraction) public onlyOwner {
        if (_royaltyReceiver.length == 1) {
            _setTokenRoyalty(_tokenId, _royaltyReceiver[0], _royaltyFraction[0]);
            _hasPaymentSplitter[_tokenId] = false;
            _hasPersonalizedRoyalties[_tokenId] = true;
        } else if (_royaltyReceiver.length > 1){
            uint96 _totalFraction = 0;
            for (uint96 i = 0; i < _royaltyReceiver.length; i++) {
                _totalFraction += _royaltyFraction[i];
            }

            // New Payment Splitter
            ShopychangePaymentSplitter _paymentSplitter = new ShopychangePaymentSplitter(
                _royaltyReceiver, _royaltyFraction
            );

            _setTokenRoyalty(_tokenId, address(_paymentSplitter), _totalFraction);
            _hasPaymentSplitter[_tokenId] = true;
            _hasPersonalizedRoyalties[_tokenId] = true;
        }
    }

    function resetTokenRoyalty(uint256 _tokenId) external onlyOwner {
        _resetTokenRoyalty(_tokenId);
        _hasPaymentSplitter[_tokenId] = false;
        _hasPersonalizedRoyalties[_tokenId] = false;
    }

    function hasPaymentSplitter(uint256 _tokenId) external view returns (bool) {
        return _hasPaymentSplitter[_tokenId];
    }

    function hasPersonalizedRoyalties(uint256 _tokenId) external view returns (bool) {
        return _hasPersonalizedRoyalties[_tokenId];
    }

    function hasDefaultPaymentSplitter() external view returns (bool) {
        return _hasDefaultPaymentSplitter;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC2981) returns (bool) {
        return interfaceId == type(IERC2981MultiReceiver).interfaceId || super.supportsInterface(interfaceId);
    }

}