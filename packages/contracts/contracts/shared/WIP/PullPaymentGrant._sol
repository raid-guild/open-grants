// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "../storage/AbstractGrantee.sol";
import "../interfaces/ITrustedToken.sol";
import "../interfaces/IBaseGrant.sol";

/**
 * @title Pull Payment Abstract Contract.
 * @dev Handles grantee withdrawal.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract PullPaymentGrant is ReentrancyGuard, AbstractGrantee, IBaseGrant {
    using SafeMath for uint256;

    /**
     * @dev Withdraws portion of the contract's available balance.
     *      Amount grantee receives is their total payoutApproved - totalPaid.
     * @param grantee Grantee address to refund.
     * @return true if withdraw successful.
     */
    function withdrawPayout(address payable grantee)
        public
        nonReentrant // OpenZeppelin mutex due to sending funds.
        returns(bool)
    {

        // Amount to be paid.
        // Will throw if grantees[grantee].payoutApproved < grantees[grantee].totalPaid
        uint256 _granteeTotalPaid = this.getGranteeTotalPaid(grantee);
        uint256 eligiblePayout = this.getGranteePayoutApproved(grantee)
            .sub(_granteeTotalPaid);


        // Update state.
        setGranteeTotalPaid(
            grantee,
            this.getGranteeTotalPaid(grantee).add(eligiblePayout)
        );

        // Send funds.
        address _currency = this.getCurrency();
        if (_currency == address(0)) {
            // @audit question for auditor: call or send?
            (bool success, ) = grantee.call{ value: eligiblePayout}("");
            require(
                success,
                "withdrawPayout::Transfer Error. Unable to send value to Grantee."
            );
        } else {
            require(
                ITrustedToken(_currency)
                    .transfer(grantee, eligiblePayout),
                "withdrawPayout::Transfer Error. ERC20 token transfer failed."
            );
        }

        emit LogPayment(grantee, eligiblePayout);
    }

}