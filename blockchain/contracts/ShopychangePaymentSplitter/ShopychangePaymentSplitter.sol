// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ShopychangePaymentSplitter is  Ownable {
    event PaymentReceived(address from, uint256 amount);
    event PaymentReleased(address to, uint256 amount);

    struct Receiver {
        address receiver;
        uint96 share;
        uint256 released;
    }

    uint96 private _totalShares;
    uint256 private _totalReleased;
    Receiver[] private _receivers;

    receive() external payable virtual {
        emit PaymentReceived(msg.sender, msg.value);
    }

    constructor(address[] memory receivers, uint96[] memory _shares) {
        require(receivers.length == _shares.length, "ShopychangePaymentSplitter: Receivers and Shares length mismatch");

        for (uint96 i = 0; i < receivers.length; i++) {
            addReceiver(receivers[i], _shares[i]);
        }
    }

    function addReceiver(address _receiver, uint96 _share) public onlyOwner {
        require(_receiver != address(0), "ShopychangePaymentSplitter: Receiver is zero address");
        require(_share > 0, "ShopychangePaymentSplitter: Share is zero");

        _receivers.push(Receiver({
        receiver : _receiver,
        share : _share,
        released : 0
        }));

        _totalShares += _share;
    }

    function removeReceiver(uint96 _index) public onlyOwner {
        require(_index < _receivers.length, "ShopychangePaymentSplitter: Index out of bounds");

        _totalShares -= _receivers[_index].share;

        _receivers[_index] = _receivers[_receivers.length - 1];
        _receivers.pop();
    }

    function getReceivers() public view returns (Receiver[] memory) {
        return _receivers;
    }

    /**
     * @dev Getter for the amount of payee's releasable Ether.
     */
    function releasable(uint96 _index) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + _totalReleased;
        return _pendingPayment(_receivers[_index].share, totalReceived, released(_index));
    }

    /**
     * @dev internal logic for computing the pending payment of an `account` given the token historical balances and
     * already released amounts.
     */
    function _pendingPayment(
        uint96 share,
        uint256 totalReceived,
        uint256 alreadyReleased
    ) private view returns (uint256) {
        return (totalReceived * share) / _totalShares - alreadyReleased;
    }

    /**
     * @dev Triggers a transfer to `account` of the amount of Ether they are owed, according to their percentage of the
     * total shares and their previous withdrawals.
     */
    function release(uint96 _index) public virtual {
        require(_receivers[_index].share > 0, "PaymentSplitter: account has no shares");

        uint256 payment = releasable(_index);

        require(payment != 0, "PaymentSplitter: account is not due payment");

        // _totalReleased is the sum of all values in _released.
        // If "_totalReleased += payment" does not overflow, then "_released[account] += payment" cannot overflow.
        _totalReleased += payment;
        unchecked {
            _receivers[_index].released += payment;
        }

        payable(_receivers[_index].receiver).transfer(payment);
        emit PaymentReleased(_receivers[_index].receiver, payment);
    }

        /**
     * @dev Getter for the amount of Ether already released to a payee.
     */
    function released(uint96 _index) public view returns (uint256) {
        return _receivers[_index].released;
    }
}