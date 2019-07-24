pragma solidity >=0.5.10 <0.6.0;
pragma experimental ABIEncoderV2;

/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @JFickel @ArnaudBrousseau
 */
contract AbstractGrant {

    /*----------  Globals  ----------*/

    mapping(bytes32 => Grant) internal _grants;                                   // Grants mapped by GUID.
    mapping(bytes32 => mapping(address => Grantee)) internal _grantees;           // Grantees mapped by Grant GUID then address.
    mapping(bytes32 => mapping(address => Grantor)) internal _grantors;           // Grantors mapped by Grant GUID then address.
    mapping(bytes32 => mapping(address => GrantManager)) internal _grantManagers; // GrantManagers mapped by Grant GUID then address.


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

    struct Payment {
        uint8 approvals; // Sum of approval weights from Grant Managers.
        uint256 amount;  // Amount to be paid.
        bool paid;       // True if paid, false if not.
    }

    struct Grantee {
        bool isGrantee;     // Is a grantee.
        address grantee;    // Address of grantee.
        uint256 allocation; // Grant size for the grantee.
        uint256 received;   // Cumulative payments received.
        Payment[] payments; // Payments to the Grantee.
    }

    struct Grantor {
        bool isGrantor;   // Is a grantor.
        address grantor;  // Address of grantor.
        uint256 funded;   // Total amount funded.
        uint256 refunded; // Cumulative amount refunded.
    }

    struct GrantManager {
        bool isGrantManager;  // Is a grant manager.
        address grantManager; // Address of grant manager.
        uint8 weight;         // Value 0 to 100.
    }

    struct Grant {
        uint16 totalGrantees;         // Number of Grantees for this grant.
        uint16 totalGrantManagers;    // Number of GrantManagers for this grant.
        uint32 totalGrantors;         // Cumulative number of Grantors for this grant.
        address currency;             // (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
        uint256 targetFunding;        // (Optional) Funding threshold required to release funds.
        uint256 totalFunded;          // Cumulative funding received for this grant.
        uint256 totalPayed;           // Cumulative funding payed to grantees.
        uint256 totalRefunded;        // Cumulative funding refunded to grantors.
        uint256 fundingExpiration;    // (Optional) Block number after which votes OR funds (dependant on GrantType) cannot be sent.
        uint256 executionExpiration;  // (Optional) Block number after which payouts must be complete or anyone can trigger refunds.
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

    /**
     * @dev Grantee requesting a payment.
     * @param id Which grant making payment.
     * @param grantee Address receiving payment.
     * @param value Amount in WEI or GRAINS refunded.
     */
    event LogPaymentRequest(bytes32 indexed id, address indexed grantee, uint256 value);

    /**
     * @dev GrantManager adding approvals to a payment.
     * @param id Which grant making payment.
     * @param grantee Address receiving payment.
     * @param value Amount in WEI or GRAINS refunded.
     */
    event LogAddPaymentApprovals(bytes32 indexed id, address indexed grantee, uint256 value, uint8 approvals);


    /*----------  Methods  ----------*/

    /**
     * @dev Grant creation function. May be called by grantors, grantees, or any other relevant party.
     * @param grantees Recipients of unlocked funds and their respective allocations.
     * @param grantManagers (Optional) Weighted managers of distribution of funds.
     * @param currency (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
     * @param targetFunding (Optional) Funding threshold required to release funds.
     * @param fundingExpiration (Optional) Block number after which votes OR funds (dependant on GrantType) cannot be sent.
     * @param executionExpiration (Optional) Block number after which payouts must be complete or anyone can trigger refunds.
     * @param grantType Which grant success scheme to apply to this grant.
     * @param extraData Support for extensions to the Standard.
     * @return GUID for this grant.
     */
    function create(
        Grantee[] memory grantees,
        GrantManager[] memory grantManagers,
        address currency,
        uint256 targetFunding,
        uint256 fundingExpiration,
        uint256 executionExpiration,
        GrantType grantType,
        bytes memory extraData
    )
        public
        returns (bytes32 id);

    /**
     * @dev Fund a grant proposal.
     * @param id GUID for the grant to fund.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Cumulative funding received for this grant.
     */
    function fund(bytes32 id, uint256 value)
        public
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
        public
        returns (uint256 balance);

    /**
     * @dev Refund a grantor.
     * @param id GUID for the grant to refund.
     * @param grantor Recipient of refund.
     * @param value Amount in WEI or GRAINS to fund.
     * @return True if successful, otherwise false.
     */
    function refund(bytes32 id, address grantor, uint256 value)
        public
        returns (uint256 balance);

    /**
     * @dev Cancel grant and enable refunds.
     * @param id GUID for the grant to refund.
     * @return True if successful, otherwise false.
     */
    function cancelGrant(bytes32 id)
        public
        returns (uint256 balance);
}
