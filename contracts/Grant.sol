pragma solidity >=0.5.10 <0.6.0;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "./AbstractGrant.sol";
import "./ISignal.sol";


/**
 * @title Grants Spec Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
contract Grant is AbstractGrant, ISignal, ReentrancyGuard {
    using SafeMath for uint256;


    /*----------  Constants  ----------*/

    uint256 PRECISION_D = 10 ** 18;


    /*----------  Constructor  ----------*/

    /**
     * @dev Grant creation function. May be called by grantors, grantees, or any other relevant party.
     * @param _grantees Sorted recipients of unlocked funds.
     * @param _amounts Respective allocations for each Grantee (must follow sort order of _grantees).
     * @param _manager (Optional) Multisig or EOA address of grant manager.
     * @param _currency (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
     * @param _targetFunding (Optional) Funding threshold required to release funds.
     * @param _fundingExpiration (Optional) Date after which votes OR funds (dependant on GrantType) cannot be sent.
     * @param _contractExpiration (Optional) Date after which payouts must be complete or anyone can trigger refunds.
     */
    constructor(
        address[] memory _grantees,
        uint256[] memory _amounts,
        address _manager,
        address _currency,
        uint256 _targetFunding,
        uint256 _fundingExpiration,
        uint256 _contractExpiration
    )
        public
    {

        require(
            _fundingExpiration == 0 || _fundingExpiration < _contractExpiration,
            "constructor::Invalid Argument. _fundingExpiration must be 0 or less than _contractExpiration."
        );

        require(
        // solium-disable-next-line security/no-block-members
            _fundingExpiration == 0 || _fundingExpiration > now,
            "constructor::Invalid Argument. _fundingExpiration must be 0 or greater than current date."
        );

        require(
        // solium-disable-next-line security/no-block-members
            _contractExpiration == 0 || _contractExpiration > now,
            "constructor::Invalid Argument. _contractExpiration must be 0 or greater than current date."
        );

        require(
            _grantees.length > 0,
            "constructor::Invalid Argument. Must have one or more grantees."
        );

        require(
            _grantees.length == _amounts.length,
            "constructor::Invalid Argument. _grantees and _amounts arrays must be of equal length."
        );

        // Initialize globals.
        manager = _manager;
        currency = _currency;
        targetFunding = _targetFunding;
        fundingExpiration = _fundingExpiration;
        contractExpiration = _contractExpiration;

        // Check _targetFunding against sum of _amounts array.
        uint256 totalFundingAmount;

        // Initialize Grantees.
        address lastAddress = address(0);
        for (uint256 i = 0; i < _grantees.length; i++) {
            address currentGrantee = _grantees[i];
            uint256 currentAmount = _amounts[i];

            require(
                currentAmount > 0,
                "constructor::Invalid Argument. Grantee's allocation (currentAmount) must be greater than 0."
            );

            require(
                currentGrantee > lastAddress,
                "constructor::Invalid Argument. Grantee's address array must be duplicate free and sorted smallest to largest."
            );

            require(
                currentGrantee != _manager,
                "constructor::Invalid Argument. _manager cannot be a Grantee."
            );

            totalFundingAmount = totalFundingAmount.add(currentAmount);
            lastAddress = currentGrantee;
            grantees[currentGrantee].targetFunding = currentAmount;
        }

        require(
            totalFundingAmount == _targetFunding,
            "constructor::Invalid Argument. _targetFunding must equal the sum of values in _amounts array."
        );

    }

    /*----------  Modifiers  ----------*/

    modifier onlyManager() {
        require(
            isManager(msg.sender),
            "onlyManager::Permission Error. Function can only be called by manager."
        );

        _;
    }

    /*----------  Public Helpers  ----------*/

    function isGrantee(address toCheck)
        public
        view
        returns(bool)
    {
        return grantees[toCheck].targetFunding > 0;
    }

    function isDonor(address toCheck)
        public
        view
        returns(bool)
    {
        return donors[toCheck].funded > 0;
    }

    function isManager(address toCheck)
        public
        view
        returns(bool)
    {
        return manager == toCheck;
    }

    function getAvailableBalance()
        public
        view
        returns(uint256 balance)
    {
        return totalFunding
            .sub(totalPayed)
            .sub(totalRefunded)
            .sub(pendingPayments);
    }

    /**
     * @dev Funding status check.
     * @return true if can fund grant.
     */
    function canFund()
        public
        view
        returns(bool)
    {
        return (
            // solium-disable-next-line security/no-block-members
            (fundingExpiration == 0 || fundingExpiration > now) &&
            totalFunding < targetFunding &&
            !grantCancelled
        );
    }

    /*----------  Public Methods  ----------*/

    /**
     * @dev Fund a grant proposal.
     * @param value Amount in WEI or GRAINS to fund.
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

        uint256 newTotalFunding = totalFunding.add(value);

        uint256 change;
        if(newTotalFunding > targetFunding) {
            change = newTotalFunding.sub(targetFunding);
            newTotalFunding = targetFunding;
        }

        // Record Contribution.
        donors[msg.sender].funded = donors[msg.sender].funded
            .add(value)
            .sub(change); // Account for change from over-funding.

        // Update funding tally.
        totalFunding = newTotalFunding;

        // Defer to correct funding method.
        if(currency == address(0)) {
            fundWithEther(value, change);
        } else {
            fundWithToken(value, change);
        }

        // Log events.
        emit LogFunding(msg.sender, value.sub(change));

        if(totalFunding == targetFunding) {
            emit LogFundingComplete();
        }

        return true;
    }

    /*----------  Manager Methods  ----------*/

    /**
     * @dev Approve payment to a grantee.
     * @param grantee Recipient of payment.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Remaining funding available in this grant.
     */
    function approvePayout(address grantee, uint256 value)
        public
        onlyManager
    {

        require(
            targetFunding == totalFunding,
            "approvePayout::Status Error. Cannot approve payment if funding target not met."
        );

        require(
            !grantCancelled,
            "approvePayout::Status Error. Cannot approve payment if grant is cancelled."
        );

        uint256 remainingAllocation = grantees[grantee].targetFunding
            .sub(grantees[grantee].totalPayed)
            .sub(grantees[grantee].payoutApproved);

        require(
            remainingAllocation >= value,
            "approvePayout::Invalid Argument. value cannot exceed Grantee's remaining allocation."
        );

        // Update state.
        grantees[grantee].payoutApproved = grantees[grantee]
            .payoutApproved.add(value);

        pendingPayments = pendingPayments.add(value);

        emit LogPaymentApproval(grantee, value);
    }

    /**
     * @dev Cancel grant and enable refunds.
     */
    function cancelGrant()
        public
    {
        require(
            !grantCancelled,
            "cancelGrant::Status Error. Already cancelled."
        );

        if (!isManager(msg.sender)) {
            // Non manager may cancel grant if:
            //      1. Funding goal not met before fundingExpiration.
            //      2. Funds not completely dispersed before contractExpiration.
            require(
                // solium-disable-next-line security/no-block-members
                (fundingExpiration != 0 && fundingExpiration <= now && totalFunding < targetFunding) ||
                (contractExpiration != 0 && contractExpiration <= now),
                // solium-disable-previous-line security/no-block-members
                "cancelGrant::Invalid Sender. Sender must be grant manager unless grant missed funding or contract expiration."
            );
        }

        totalRefunded = totalRefunded.add(getAvailableBalance());

        grantCancelled = true;

        emit LogGrantCancellation();
    }


    /**
     * @dev Approve refunding a portion of the contract's available balance.
     *      Refunds are split between donors based on their contribution to totalFunded.
     * @param amount Amount to refund.
     */
    function approveRefund(uint256 amount)
        public
        onlyManager
    {
        require(
            amount <= getAvailableBalance(),
            "approveRefund::Invalid Argument. Amount must be less than or equal to the contract's Available Balance."
        );

        totalRefunded = totalRefunded.add(amount);

        emit LogRefundApproval(amount, totalRefunded);
    }


    /*----------  Signal Methods  ----------*/

    /**
     * @dev Voting Signal Method.
     * @param support true if in support of grant false if opposed.
     * @param value Number of signals denoted in Token GRAINs or WEI.
     * @return True if successful, otherwise false.
     */
    function signal(bool support, uint256 value)
        external
        payable
        returns (bool)
    {

        require(
            totalFunding < targetFunding,
            "signal::Status Error. Signalling only permitted prior to reaching funding target."
        );

        emit LogSignal(support, msg.sender, currency, value);

        // Prove signaler has control of funds.
        if (currency == address(0)) {
            require(
                msg.value == value,
                "signal::Invalid Argument. value must match msg.value."
            );

            require(
                // solium-disable-next-line security/no-send
                msg.sender.send(msg.value),
                "signal::Transfer Error. Unable to send msg.value back to sender."
            );
        } else {
            require(
                msg.value == 0,
                "signal::Currency Error. Cannot send Ether to a token funded grant."
            );

            // Transfer to this contract.
            require(
                IERC20(currency)
                    .transferFrom(msg.sender, address(this), value),
                "signal::Transfer Error. ERC20 token transferFrom failed."
            );

            // Transfer back to sender.
            require(
                IERC20(currency)
                    .transfer(msg.sender, value),
                "signal::Transfer Error. ERC20 token transfer failed."
            );
        }

        return true;
    }


    /*----------  Withdrawal Methods  ----------*/

    function withdrawPayout(address grantee, uint256 value)
        public
        nonReentrant
        returns (bool)
    {
        require(
            grantees[grantee].payoutApproved == value,
            "withdrawPayout::Invalid Argument. grantee payoutApproved does not match value."
        );

        // Update state.
        totalPayed = totalPayed.add(value);
        pendingPayments = pendingPayments.sub(value);
        grantees[grantee].payoutApproved = 0;
        grantees[grantee].totalPayed = grantees[grantee].totalPayed.add(value);

        // Send funds.
        if (currency == address(0)) {
            require(
                // solium-disable-next-line security/no-send
                msg.sender.send(value),
                "withdrawPayout::Transfer Error. Unable to send value to Grantee."
            );
        } else {
            require(
                IERC20(currency)
                    .transfer(grantee, value),
                "withdrawPayout::Transfer Error. ERC20 token transfer failed."
            );
        }

        emit LogPayment(grantee, value);

        return true;
    }


    function withdrawRefund(address donor)
        public
        nonReentrant
        returns(bool)
    {

        uint256 percentContributed = donors[donor].funded
            .mul(PRECISION_D).div(
                totalFunding
            );

        // Donor's share of refund.
        uint256 eligibleRefund = totalRefunded
            .mul(percentContributed)
            .div(PRECISION_D);

        require(
            eligibleRefund >= donors[donor].refunded,
            "withdrawRefund::Error. Donor has already withdrawn currently eligible refund."
        );

        // Minus previous withdrawals.
        eligibleRefund = eligibleRefund.sub(donors[donor].refunded);

        // Update state.
        donors[donor].refunded = donors[donor].refunded.add(eligibleRefund);

        // Send funds.
        if (currency == address(0)) {
            require(
                // solium-disable-next-line security/no-send
                msg.sender.send(eligibleRefund),
                "withdrawRefund::Transfer Error. Unable to send refundValue to Donor."
            );
        } else {
            require(
                IERC20(currency)
                    .transfer(donor, eligibleRefund),
                "withdrawRefund::Transfer Error. ERC20 token transfer failed."
            );
        }

        emit LogRefund(donor, eligibleRefund);

        return true;
    }


    /*----------  Private Methods  ----------*/

    function fundWithEther(uint256 value, uint256 change)
        private
    {
        require(
            msg.value == value,
            "fundWithEther::Invalid Argument. value must equal msg.value. Consider using the fallback function for Ether donations."
        );

        require(
            msg.value > 0,
            "fundWithEther::Invalid Value. msg.value be greater than 0."
        );

        // Send change as refund.
        if (change > 0) {
            require(
                // solium-disable-next-line security/no-send
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

        // Subtract change before transferring to grant contract.
        uint256 netValue = value.sub(change);
        require(
            IERC20(currency)
                .transferFrom(msg.sender, address(this), netValue),
            "fund::Transfer Error. ERC20 token transferFrom failed."
        );
    }


    /*----------  Fallback  ----------*/

    function ()
        external
        payable
    {
        fund(msg.value);
    }
}
