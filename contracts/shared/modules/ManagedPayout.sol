// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../libraries/Percentages.sol";
import "../storage/AbstractGrantee.sol";
import "../interfaces/IManager.sol";
import "../interfaces/IFunding.sol";
import "../storage/AbstractBaseGrant.sol";
import "../interfaces/IGranteeAllocation.sol";


/**
 * @title Managed Payout Abstract Contract.
 * @dev Handles approval of grantee payouts.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract ManagedPayout is IManager, IFunding, IGranteeAllocation, AbstractBaseGrant, AbstractGrantee {
    using SafeMath for uint256;

    /*----------  Events  ----------*/

    /**
     * @dev Manager approving a payment.
     * @param grantee Address receiving payment.
     * @param value Amount in WEI or ATOMIC_UNITS approved for payment.
     */
    event LogPaymentApproval(address indexed grantee, uint256 value);


    /*----------  Public Methods  ----------*/


    /**
     * @dev Approve payment to a grantee.
     * @param value Amount in WEI or ATOMIC_UNITS to approve.
     * @param grantee Recipient of payment.
     */
    function approvePayout(uint256 value, address grantee)
        public
        returns(bool)
    {

        this.requireManager();

        uint256 _targetFunding = this.getTargetFunding();
        require(
            (_targetFunding == 0 || _targetFunding == this.getTotalFunding()),
            "approvePayout::Status Error. Cannot approve if funding target not met."
        );

        require(
            (value > 0),
            "approvePayout::Value Error. Must be non-zero value."
        );

        require(
            !this.getGrantCancelled(),
            "approvePayout::Status Error. Cannot approve if grant is cancelled."
        );


        if (this.getPercentageBased()) {

            uint256 granteesMaxAllocation = Percentages.maxAllocation(
                this.getGranteeTargetFunding(grantee),
                this.getCumulativeTargetFunding(),
                this.getTotalFunding()
            );

            require(
                granteesMaxAllocation >= value,
                "approvePayout::Invalid Argument. value cannot exceed granteesMaxAllocation."
            );

        } else {

            require(
                this.remainingAllocation(grantee) >= value,
                "approvePayout::Invalid Argument. value cannot exceed remaining allocation."
            );

        }


        // Update state.
        setTotalPaid(this.getTotalPaid().add(value));
        setGranteePayoutApproved(
            grantee,
            this.getGranteePayoutApproved(grantee).add(value)
        );

        emit LogPaymentApproval(grantee, value);

        return true;
    }

}