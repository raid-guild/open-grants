// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IBaseGrant.sol";
import "../storage/AbstractDonorFund.sol";
import "../interfaces/IManager.sol";
import "../interfaces/IGrantee.sol";
import "../interfaces/ITrustedToken.sol";
import "../storage/AbstractFunding.sol";

/**
 * @title Fund Grant Abstract Contract.
 * @dev Handles funding the grant.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract FundGrant is ReentrancyGuard, AbstractFunding, AbstractDonorFund, IBaseGrant, IGrantee, IManager {
    using SafeMath for uint256;

    /*----------  Global Variables  ----------*/

    bool fundingActive = true;               // When false new funding is rejected.


    /*----------  Public Helpers  ----------*/

    /**
     * @dev Funding status check.
     * `fundingDeadline` may be 0, in which case `now` does not impact canFund response.
     * `targetFunding` may be 0, in which case `totalFunding` oes not impact can fund response.
     * @return true if can fund grant.
     */
    function canFund()
        public
        view
        returns(bool)
    {

        uint256 fundingDeadline = this.getFundingDeadline();
        uint256 targetFunding = this.getTargetFunding();
        uint256 totalFunding = this.getTotalFunding();

        return (
            // solhint-disable-next-line not-rely-on-time
            (fundingDeadline == 0 || fundingDeadline > now) &&
            (targetFunding == 0 || totalFunding < targetFunding) &&
            fundingActive &&
            !this.getGrantCancelled()
        );
    }


    /*----------  Public Methods  ----------*/

    /**
     * @dev Fund a grant proposal.
     * @param value Amount in WEI or ATOMIC_UNITS to fund.
     * @return Cumulative funding received for this grant.
     */
    function fund(uint256 value)
        public
        nonReentrant // OpenZeppelin mutex due to sending change if over-funded.
        returns (bool)
    {

        require(
            canFund(),
            "fund::Status Error. Grant not open to funding."
        );

        require(
            !this.isManager(msg.sender),
            "fund::Permission Error. Grant Manager cannot fund."
        );

        require(
            this.getGranteeTargetFunding(msg.sender) == 0,
            "fund::Permission Error. Grantee cannot fund."
        );

        uint256 newTotalFunding = this.getTotalFunding().add(value);

        uint256 _targetFunding = this.getTargetFunding();
        uint256 change = 0;
        if(_targetFunding != 0 && newTotalFunding > _targetFunding) {
            change = newTotalFunding.sub(_targetFunding);
            newTotalFunding = _targetFunding;
        }

        // Record Contribution.
        setDonorFunded(
            msg.sender,
            this.getDonorFunded(msg.sender).add(value).sub(change) // Account for change from over-funding.
        );


        // Update funding tally.
        setTotalFunding(newTotalFunding);

        // Defer to correct funding method.
        if(this.getCurrency() == address(0)) {
            fundWithEther(value, change);
        } else {
            fundWithToken(value, change);
        }

        // Log events.
        emit LogFunding(msg.sender, value.sub(change));

        if(this.getTargetFunding() != 0 && this.getTotalFunding() == this.getTargetFunding()) {
            emit LogFundingComplete();
        }

        return true;
    }


    /*----------  Private Methods  ----------*/

    function fundWithEther(uint256 value, uint256 change)
        private
    {
        require(
            msg.value == value,
            "fundWithEther::Invalid Argument. value must equal msg.value."
        );

        require(
            msg.value > 0,
            "fundWithEther::Invalid Value. msg.value must be greater than 0."
        );

        // Send change as refund.
        if (change > 0) {
            require(
                // solhint-disable-next-line check-send-result
                msg.sender.send(change),
                "fundWithEther::Transfer Error. Unable to send change back to sender."
            );
        }
    }

    function fundWithToken(uint256 value, uint256 change)
        private
    {
        require(
            msg.value == 0,
            "fundWithToken::Currency Error. Cannot send Ether to a token funded grant."
        );

        require(
            value > 0,
            "fundWithToken::::Invalid Value. value must be greater than 0."
        );

        // Subtract change before transferring to grant contract.
        uint256 netValue = value.sub(change);
        require(
            ITrustedToken(this.getCurrency())
                .transferFrom(msg.sender, address(this), netValue),
            "fund::Transfer Error. ERC20 token transferFrom failed."
        );
    }


}