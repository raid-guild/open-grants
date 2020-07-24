// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "./Refundable.sol";
import "../storage/AbstractBaseGrant.sol";
import "../interfaces/IManager.sol";

/**
 * @title Cancelable and Refundable Grant.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract CancelableRefundable is IManager, Refundable, AbstractBaseGrant  {

    /*----------  Events  ----------*/

    /**
     * @dev Grant cancellation event.
     */
    event LogGrantCancellation();


    /*----------  Public Methods  ----------*/

    /**
     * @dev Cancel grant and enable refunds.
     */
    function cancelGrant()
        public
    {
        require(
            !this.getGrantCancelled(),
            "cancelGrant::Status Error. Already cancelled."
        );

        if (!this.isManager(msg.sender)) {
            uint256 _fundingDeadline = this.getFundingDeadline();
            uint256 _contractExpiration = this.getContractExpiration();
            // Non-manager may cancel grant if:
            //      1. Funding goal not met before fundingDeadline.
            //      2. Funds not completely dispersed before contractExpiration.
            require(
                /* solhint-disable not-rely-on-time */
                (_fundingDeadline != 0 && _fundingDeadline <= now && this.getTotalFunding() < this.getTargetFunding()) ||
                (_contractExpiration != 0 && _contractExpiration <= now),
                /* solhint-enable not-rely-on-time */
                "cancelGrant::Invalid Sender. Sender must be manager or expired."
            );
        }

        setTotalRefunded(
            this.getTotalRefunded().add(this.availableBalance())
        );

        setGrantCancelled(true);

        emit LogGrantCancellation();
    }
}