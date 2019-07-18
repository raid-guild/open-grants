pragma solidity >=0.5.10 <0.6.0;
pragma experimental ABIEncoderV2;

/**
 * @title Grants Spec Interface.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @JFickel @ArnaudBrousseau
 */
interface IGrant {

    /*----------  Types  ----------*/

    enum GrantType {
        FUND_THRESHOLD, // Funds unlocked if threshold met.
        FUNDER_VOTE,    // Funds unlocked if funders approve.
        MANAGED,        // Funds unlocked by grant_managers.
        OPAQUE          // Other offchain method.
    }

    enum GrantStatus {
        INIT,    // Null status.
        SIGNAL,  // Non-binding carbon vote.
        FUND,    // Fundraising period.
        PAY,     // Payout period.
        REFUND,  // Refund to original funders.
        COMPLETE // Grant complete.
    }

    struct Grantee {
        address grantee;    // Address of grantee.
        uint256 allocation; // Grant size for the grantee.
        uint256 received;   // Cumulative payments received.
    }

    struct Grantor {
        address grantor;  // Address of grantor.
        uint256 funded;   // Total amount funded.
        uint256 refunded; // Cumulative amount refunded.
    }

    struct GrantManager {
        address grantManager; // Address of grant manager.
        uint8 weight;         // Value 0 to 255.
    }

    struct Grant {
        Grantee[] grantees;           // Grant recipients.
        Grantor[] grantors;           // Funders of the grant.
        GrantManager[] grantManagers; // (Optional) Addresses that manage distribution of funds.
        address currency;             // (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
        uint256 targetFunding;        // (Optional) Funding threshold required to release funds.
        uint256 totalFunded;          // Cumulative funding received for this grant.
        uint256 totalPayed;           // Cumulative funding payed to grantees.
        uint256 expiration;           // (Optional) Block number after which votes OR funds (dependant on GrantType) cannot be sent.
        GrantType grantType;          // Which grant success scheme to apply to this grant.
        GrantStatus grantStatus;      // Current GrantStatus.
        bytes extraData;              // Support for extensions to the Standard.
    }


    /*----------  Events  ----------*/

    /**
     * @dev Change in GrantStatus.
     * @param id Which Grant's status changed.
     * @param grantStatus New GrantStatus.
     */
    event LogStatusChange(bytes32 indexed id, GrantStatus grantStatus);

    /**
     * @dev Grant received funding.
     * @param id Which Grant received funding.
     * @param grantor Address funding the grant.
     * @param value Amount in WEI or GRAINS funded.
     */
    event LogFunding(bytes32 indexed id, address indexed grantor, uint256 value);

    /**
     * @dev Grant refunding funding.
     * @param id Which grant refunding.
     * @param grantor Address receiving refund.
     * @param value Amount in WEI or GRAINS refunded.
     */
    event LogRefund(bytes32 indexed id, address indexed grantor, uint256 value);

    /**
     * @dev Grant paying grantee.
     * @param id Which grant making payment.
     * @param grantee Address receiving payment.
     * @param value Amount in WEI or GRAINS refunded.
     */
    event LogPayment(bytes32 indexed id, address indexed grantee, uint256 value);


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
        returns (bytes32 id);

    /**
     * @dev Fund a grant proposal.
     * @param id GUID for the grant to fund.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Cumulative funding received for this grant.
     */
    function fund(bytes32 id, uint256 value)
        external
        payable
        returns (uint256 balance);

    /**
     * @dev Pay a grantee.
     * @param id GUID for the grant to fund.
     * @param grantee Recipient of payment.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Remaining funding available in this grant.
     */
    function payout(bytes32 id, address grantee, uint256 value)
        external
        returns (uint256 balance);

    /**
     * @dev Refund a grantor.
     * @param id GUID for the grant to refund.
     * @param grantor Recipient of refund.
     * @param value Amount in WEI or GRAINS to fund.
     * @return True if successful, otherwise false.
     */
    function refund(bytes32 id, address grantor, uint256 value)
        external
        returns (bool);

    /**
     * @dev Refund all grantors.
     * @param id GUID for the grant to refund.
     * @return True if successful, otherwise false.
     */
    function refundAll(bytes32 id)
        external
        returns (bool);

    /**
     * @dev Cancel grant and enable refunds.
     * @param id GUID for the grant to refund.
     * @return True if successful, otherwise false.
     */
    function cancelGrant(bytes32 id)
        external
        returns (bool);
}
