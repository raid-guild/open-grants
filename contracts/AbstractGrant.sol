pragma solidity >=0.5.10 <0.6.0;
pragma experimental ABIEncoderV2;

/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
contract AbstractGrant {

    /*----------  Globals  ----------*/

    address public manager;                      // Multisig or EOA address to manage grant.
    address public currency;                     // (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
    uint256 public targetFunding;                // (Optional) Funding threshold required to release funds.
    uint256 public totalFunding;                 // Cumulative funding donated by donors.
    uint256 public totalPayed;                   // Cumulative funding payed to grantees.
    uint256 public totalRefunded;                // Cumulative funding refunded to grantors.
    uint256 public fundingExpiration;            // (Optional) Block number after which votes OR funds (dependant on GrantType) cannot be sent.
    uint256 public contractExpiration;           // (Optional) Block number after which payouts must be complete or anyone can trigger refunds.
    uint256 public refundCheckpoint;             // Balance when donor initiated refund begins. Calculate % of funds donor may refund themself.
    GrantStatus public grantStatus;              // Current GrantStatus.
    mapping(address => Grantee) grantees;        // Grant recipients by address.
    mapping(address => Donor) donors;            // Donors by address.

    /*----------  Types  ----------*/


    // TODO: Confirm GrantStatus not needed for FUNDRAISING as it can be inferred.

    // 1. INIT is fine - contract deployment
    // 2. remove SIGNAL
    // 3. FUNDRAISING is fine - fund start timestamp passed
    // 4. working
    // 5. done (all refunds allowed)

    // INIT -> FUNDRAISING -> SUCCESS -> DONE
    //                     -> DONE

    enum GrantStatus {
        INIT,    // Contract Deployment.
        SUCCESS, // Grant successfully funded.
        DONE     // Grant complete and funds dispersed, or grant cancelled.
    }

    struct Grantee {
        uint256 targetFunding;   // Funding amount targeted for Grantee.
        uint256 totalPayed;      // Cumulative funding received by Grantee.
        uint256 payoutApproved;  // Pending payout approved by Manager.
    }

    struct Donor {
        uint256 funded;          // Total amount funded.
        uint256 refunded;        // Cumulative amount refunded.
        uint256 refundApproved;  // Pending refund approved by Manager.
    }


    /*----------  Events  ----------*/

    /**
     * @dev Change in GrantStatus.
     * @param grantStatus New GrantStatus.
     */
    event LogStatusChange(GrantStatus grantStatus);

    /**
     * @dev Grant received funding.
     * @param donor Address funding the grant.
     * @param value Amount in WEI or GRAINS funded.
     */
    event LogFunding(address indexed donor, uint256 value);

    /**
     * @dev Grant refunding funding.
     * @param donor Address receiving refund.
     * @param value Amount in WEI or GRAINS refunded.
     */
    event LogRefund(address indexed donor, uint256 value);

    /**
     * @dev Grant paying grantee.
     * @param grantee Address receiving payment.
     * @param value Amount in WEI or GRAINS refunded.
     */
    event LogPayment(address indexed grantee, uint256 value);

    /**
     * @dev Manager approving a payment.
     * @param grantee Address receiving payment.
     * @param value Amount in WEI or GRAINS refunded.
     */
    event LogPaymentApproval(address indexed grantee, uint256 value);

    /**
     * @dev Manager approving a refund.
     * @param donor Address receiving refund.
     * @param value Amount in WEI or GRAINS refunded.
     */
    event LogRefundApproval(address indexed donor, uint256 value);


    /*----------  Methods  ----------*/

    /**
     * @dev Total funding getter.
     * @return Cumulative funding received for this grant.
     */
    function getTotalFunding()
        public
        view
        returns (uint256 funding);

    /**
     * @dev Fund a grant proposal.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Remaining funding available in this grant.
     */
    function fund(uint256 value)
        public
        payable
        returns (uint256 balance);

    /**
     * @dev Pay a grantee.
     * @param grantee Recipient of payment.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Remaining funding available in this grant.
     */
    function payout(address grantee, uint256 value)
        public
        returns (uint256 balance);

    /**
     * @dev Refund a grantor.
     * @param donor Recipient of refund.
     * @return Remaining funding available in this grant.
     */

    // TODO: MUST BE DONE
    // any donor can receive up to their maximum
    // - their fraction of (total funding - total spent) * (donor value / total funding)
    // - only allow refunds in full
    // - check that donor refund = 0
    function refund(address donor)
        public
        returns (uint256 balance);

    /**
     * @dev Cancel grant and enable refunds.
     * @return Remaining funding available in this grant.
     */
    function cancelGrant()
        public
        returns (uint256 balance);
}
