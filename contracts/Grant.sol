pragma solidity >=0.5.10 <0.6.0;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./FundThreshold.sol";
import "./ISignal.sol";


/**
 * @title Grants Spec Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @JFickel @ArnaudBrousseau
 */
contract Grant is FundThreshold, ISignal {
    using SafeMath for uint256;


    /*----------  Modifiers  ----------*/

    modifier isGrantee(bytes32 id) {
        require(
            _grantees[id][msg.sender].isGrantee,
            "isGrantee::Invalid Sender. Sender is not a grantee for this grant."
        );

        _;
    }


    /*----------  Public Getters  ----------*/

    /**
     * @dev Grant Getter.
     * @param id GUID for the grant to return.
     * @return The Grant struct.
     */
    function getGrant(bytes32 id)
        public
        view
        returns (Grant memory)
    {
        return _grants[id];
    }

    /**
     * @dev Grantor Getter.
     * @param id GUID for the grant.
     * @param grantor Address for the grantor.
     * @return The Grantor struct.
     */
    function getGrantor(bytes32 id, address grantor)
        public
        view
        returns (Grantor memory)
    {
        return _grantors[id][grantor];
    }

    /**
     * @dev Grantee Getter.
     * @param id GUID for the grant.
     * @param grantee Address for the grantee.
     * @return The Grantee struct.
     */
    function getGrantee(bytes32 id, address grantee)
        public
        view
        returns (Grantee memory)
    {
        return _grantees[id][grantee];
    }

    /**
     * @dev GrantManager Getter.
     * @param id GUID for the grant.
     * @param grantManager Address for the grantManager.
     * @return The GrantManager struct.
     */
    function getGrantManager(bytes32 id, address grantManager)
        public
        view
        returns (GrantManager memory)
    {
        return _grantManagers[id][grantManager];
    }


    /*----------  Public Methods  ----------*/

    /**
     * @dev Grant creation function. May be called by grantors, grantees, or any other relevant party.
     * @param grantees Recipients of unlocked funds and their respective allocations.
     * @param grantManagers (Optional) Weighted managers of distribution of funds.
     * @param currency (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
     * @param targetFunding (Optional) Funding threshold required to release funds.
     * @param expiration (Optional) Block number after which votes OR funds (dependant on GrantType) cannot be sent.
     * @param grantType Which grant success scheme to apply to this grant.
     * @param extraData Support for extensions to the Standard.
     * @return GUID for this grant.
     */
    function create(
        Grantee[] memory grantees,
        GrantManager[] memory grantManagers,
        address currency,
        uint256 targetFunding,
        uint256 expiration,
        GrantType grantType,
        bytes memory extraData
    )
        public
        returns (bytes32 id)
    {
        // GUID created by hashing sender address and previous block's hash.
        // Provides a safe source of uniqueness as there is no benefit to
        // manipulating keys (i.e. no reward for guessing RNG output).
        //
        // The one drawback of this approach is that the same address cannot
        // create more than one grants in the same block (the second grant will
        // fail due to the grant status not being GrantStatus.INIT).
        bytes32 _id = keccak256(abi.encodePacked(
            msg.sender,
            // solium-disable-next-line security/no-block-members
            blockhash(block.number.sub(1))
        ));

        require(
            _grants[_id].grantStatus == GrantStatus.INIT,
            "create::Status Error. Grant ID already in use."
        );

        require(
            // solium-disable-next-line security/no-block-members
            expiration == 0 || expiration > block.number,
            "create::Invalid Argument. Expiration must be 0 or greater than current block."
        );

        require(
            grantees.length > 0,
            "create::Invalid Argument. Must have one or more grantees."
        );

        for (uint256 i = 0; i < grantees.length; i++) {
            Grantee memory grantee = grantees[i];
            grantee.isGrantee = true;
            _grantees[_id][grantee.grantee] = grantee;
        }

        for (uint256 i = 0; i < grantManagers.length; i++) {
            GrantManager memory grantManager = grantManagers[i];
            grantManager.isGrantManager = true;
            _grantManagers[_id][grantManager.grantManager] = grantManager;
        }

        _grants[_id].totalGrantees = uint16(grantees.length);
        _grants[_id].totalGrantManagers = uint16(grantManagers.length);
        _grants[_id].currency = currency;
        _grants[_id].targetFunding = targetFunding;
        _grants[_id].expiration = expiration;
        _grants[_id].grantType = grantType;
        _grants[_id].grantStatus = GrantStatus.SIGNAL;
        _grants[_id].extraData = extraData;

        emit LogStatusChange(_id, GrantStatus.SIGNAL);

        return _id;
    }

    /**
     * @dev Fund a grant proposal.
     * @param id GUID for the grant to fund.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Cumulative funding received for this grant.
     */
    function fund(bytes32 id, uint256 value)
        public
        payable
        returns (uint256 balance)
    {
        // Defer to correct funding method.
        if(_grants[id].currency == address(0)) {
            require(
                msg.value == value,
                "fund::Invalid Argument. value must match msg.value."
            );
        } else {
            require(
                IERC20(_grants[id].currency)
                    .transferFrom(msg.sender, address(this), value),
                "fund::Transfer Error. ERC20 token transferFrom failed."
            );
        }

        // Record Contribution.
        if (!_grantors[id][msg.sender].isGrantor) {
            _grantors[id][msg.sender] = Grantor({
                isGrantor: true,
                grantor: msg.sender,
                funded: value,
                refunded: 0
            });

            _grants[id].totalGrantors = uint32(uint256(_grants[id].totalGrantors).add(1));
        } else {
            _grantors[id][msg.sender].funded = _grantors[id][msg.sender]
                .funded.add(value);
        }

        // Update funding tally.
        balance = _grants[id].totalFunded.add(value);
        _grants[id].totalFunded = balance;

        // Log event.
        emit LogFunding(id, msg.sender, value);

        // May expand to handle variety of grantTypes.
        uint256 result;
        if (_grants[id].grantType == GrantType.FUND_THRESHOLD) {
           result = FundThreshold.fund(id, value);
        }

        return result;
    }

    /**
     * @dev Pay a grantee.
     * @param id GUID for the grant to fund.
     * @param grantee Recipient of payment.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Remaining funding available in this grant.
     */
    function payout(bytes32 id, address grantee, uint256 value)
        public
        returns (uint256 balance)
    {
        return value;
    }

    /**
     * @dev Refund a grantor.
     * @param id GUID for the grant to refund.
     * @param grantor Recipient of refund.
     * @param value Amount in WEI or GRAINS to fund.
     * @return True if successful, otherwise false.
     */
    function refund(bytes32 id, address grantor, uint256 value)
        public
        returns (bool)
    {
        return true;
    }

    /**
     * @dev Refund all grantors.
     * @param id GUID for the grant to refund.
     * @return True if successful, otherwise false.
     */
    function refundAll(bytes32 id)
        public
        returns (bool)
    {
        return true;
    }

    /**
     * @dev Cancel grant and enable refunds.
     * @param id GUID for the grant to refund.
     * @return True if successful, otherwise false.
     */
    function cancelGrant(bytes32 id)
        public
        returns (bool)
    {
        require(
            _grants[id].grantStatus == GrantStatus.SIGNAL ||
            _grants[id].grantStatus == GrantStatus.FUND ||
            _grants[id].grantStatus == GrantStatus.PAY,
            "cancelGrant::Status Error. Must be GrantStatus.SIGNAL, GrantStatus.FUND, or GrantStatus.PAY to cancel."
        );

        bool granteeOrGrantManager = _grantees[id][msg.sender].isGrantee ||
            _grantManagers[id][msg.sender].isGrantManager;

        require(
            granteeOrGrantManager,
            "cancelGrant::Invalid Sender. Only a Grantee or GrantManager may cancel the grant."
        );

        if (_grants[id].grantStatus == GrantStatus.SIGNAL) {
            _grants[id].grantStatus = GrantStatus.COMPLETE;
            emit LogStatusChange(id, GrantStatus.COMPLETE);
        } else {
            _grants[id].grantStatus = GrantStatus.REFUND;
            emit LogStatusChange(id, GrantStatus.REFUND);
        }
        return true;
    }

    /**
     * @dev Voting Signal Method.
     * @param id The ID of the grant to signal in favor for.
     * @param value Number of signals denoted in Token GRAINs or WEI.
     * @return True if successful, otherwise false.
     */
    function signal(bytes32 id, uint256 value)
        external
        payable
        returns (bool)
    {

        require(
            _grants[id].grantStatus == GrantStatus.SIGNAL,
            "signal::Status Error. Must be GrantStatus.SIGNAL to signal."
        );

        address token = _grants[id].currency;

        emit LogSignal(id, msg.sender, token, value);

        // Prove signaler has control of tokens.
        if (token == address(0)) {
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
            // Transfer to this contract.
            require(
                IERC20(token)
                    .transferFrom(msg.sender, address(this), value),
                "signal::Transfer Error. ERC20 token transferFrom failed."
            );

            // Transfer back to sender.
            require(
                IERC20(token)
                    .transfer(msg.sender, value),
                "signal::Transfer Error. ERC20 token transfer failed."
            );
        }

        return true;
    }

    /**
     * @dev End signaling and move to next GrantStatus.
     * @param id The GUID of the grant to end signaling for.
     */
    function endSignaling(bytes32 id)
        public
        isGrantee(id)
        returns (bool)
    {
        require(
            _grants[id].grantStatus == GrantStatus.SIGNAL,
            "endSignaling::Status Error. Must be GrantStatus.SIGNAL to end signaling."
        );

        _grants[id].grantStatus = GrantStatus.FUND;

        emit LogStatusChange(id, GrantStatus.FUND);

        return true;
    }

}
