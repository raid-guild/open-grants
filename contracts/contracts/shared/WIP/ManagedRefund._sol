// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Refundable.sol";
import "../interfaces/IManager.sol";

/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract ManagedRefund is IManager, Refundable {
    using SafeMath for uint256;


    /*----------  Events  ----------*/

    /**
     * @dev Manager approving a refund.
     * @param amount Amount in WEI or ATOMIC_UNITS refunded across all donors.
     * @param totalRefunded Cumulative amount in WEI or ATOMIC_UNITS refunded across all donors.
     */
    event LogRefundApproval(uint256 amount, uint256 totalRefunded);


    /*----------  Manager Methods  ----------*/

     /**
     * @dev Approve refunding a portion of the contract's available balance.
     *      Refunds are split between donors based on their contribution to totalFunded.
     * @param value Amount to refund.
     */
    function approveRefund(uint256 value)
        public
    {
        this.requireManager();

        require(
            value <= availableBalance(),
            "approveRefund::Invalid Argument. Amount is greater than Available Balance."
        );

        // Refunds are based on percent donated. To ensure donors are awarded the correct refund amount,
        // refunds may only occur if the grant is cancelled,
        // or if no further funds are to be accepted (i.e. when there is a targetFunding)
        
        uint256 _targetFunding = this.getTargetFunding();
        require(
            (_targetFunding != 0 && _targetFunding == this.getTotalFunding()),
            "approveRefund::Not Permitted. Partial Refunds not permitted if no targetFunding. cancelGrant instead."
        );

        uint256 newTotalRefunded = this.getTotalRefunded().add(value);
        setTotalRefunded(newTotalRefunded);

        emit LogRefundApproval(value, newTotalRefunded);
    }

}