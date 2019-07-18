pragma solidity >=0.5.10 <0.6.0;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./IGrant.sol";
import "./ISignal.sol";


/**
 * @title Grants Spec Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @JFickel @ArnaudBrousseau
 */
contract Grant is IGrant, ISignal {
    using SafeMath for uint256;


    /*----------  Globals  ----------*/

    mapping(bytes32 => Grant) grants; // Grants mapped by GUID.


    /*----------  Methods  ----------*/

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
        Grantee[] calldata grantees,
        GrantManager[] calldata grantManagers,
        address currency,
        uint256 targetFunding,
        uint256 expiration,
        GrantType grantType,
        bytes calldata extraData
    )
        external
        returns (bytes32 id)
    {
        bytes32 _id = keccak256(abi.encodePacked(
            msg.sender,
            // solium-disable-next-line security/no-block-members
            blockhash(block.number.sub(1))
        ));

        require(
            grants[_id].grantStatus == GrantStatus.INIT,
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
            grants[_id].grantees.push(grantee);
        }

        for (uint256 i = 0; i < grantees.length; i++) {
            GrantManager memory grantManager = grantManagers[i];
            grants[_id].grantManagers.push(grantManager);
        }

        grants[_id].currency = currency;
        grants[_id].targetFunding = targetFunding;
        grants[_id].expiration = expiration;
        grants[_id].grantType = grantType;
        grants[_id].grantStatus = GrantStatus.SIGNAL;
        grants[_id].extraData = extraData;

        emit LogStatusChange(_id, GrantStatus.SIGNAL);

        return _id;
    }

    /**
     * @dev Grant Getter.
     * @param id GUID for the grant to return.
     * @return The Grant struct.
     */
    function getGrant(bytes32 id)
        external
        view
        returns (Grant memory)
    {
        return grants[id];
    }

    /**
     * @dev Fund a grant proposal.
     * @param id GUID for the grant to fund.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Cumulative funding received for this grant.
     */
    function fund(bytes32 id, uint256 value)
        external
        payable
        returns (uint256 balance)
    {
        return value;
    }

    /**
     * @dev Pay a grantee.
     * @param id GUID for the grant to fund.
     * @param grantee Recipient of payment.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Remaining funding available in this grant.
     */
    function payout(bytes32 id, address grantee, uint256 value)
        external
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
        external
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
        external
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
        external
        returns (bool)
    {
        return true;
    }

        /**
     * @dev Voting Signal Method.
     * @param id The ID of the grant to vote in favor for.
     * @param token Address of token or NULL for Ether based vote.
     * @param value Number of votes denoted in Token GRAINs or WEI.
     * @return True if successful, otherwise false.
     */
    function signal(bytes32 id, address token, uint256 value)
        external
        payable
        returns (bool)
    {
        return true;
    }
}
