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
    uint256 public targetFunding;                // (Optional) Funding threshold required to begin releasing funds.
    uint256 public totalFunding;                 // Cumulative funding donated by donors.
    uint256 public totalPayed;                   // Cumulative funding payed to grantees.
    uint256 public totalRefunded;                // Cumulative funding refunded to donors.
    uint256 public pendingPayments;              // Payments approved to grantees but not yet withdrawn.
    uint256 public fundingExpiration;            // (Optional) Block number after which votes OR funds (dependant on GrantType) cannot be sent.
    uint256 public contractExpiration;           // (Optional) Block number after which payouts must be complete or anyone can trigger refunds.
    uint256 public refundCheckpoint;             // Balance when donor initiated refund begins. Calculate % of funds donor may refund themself.
    bool public grantCancelled;                  // Flag to indicate when grant is cancelled.
    mapping(address => Grantee) public grantees; // Grant recipients by address.
    mapping(address => Donor) public donors;     // Donors by address.

    /*----------  Types  ----------*/

    struct Grantee {
        uint256 targetFunding;   // Funding amount targeted for Grantee.
        uint256 totalPayed;      // Cumulative funding received by Grantee.
        uint256 payoutApproved;  // Pending payout approved by Manager.
    }

    struct Donor {
        uint256 funded;          // Total amount funded.
        uint256 refunded;        // Cumulative amount refunded.
    }


    /*----------  Events  ----------*/

    /**
     * @dev Funding target reached event.
     */
    event LogFundingComplete();

    /**
     * @dev Grant cancellation event.
     */
    event LogGrantCancellation();

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
     * @param amount Amount in WEI or GRAINS refunded across all donors.
     * @param totalRefunded Cumulative amount in WEI or GRAINS refunded across all donors.
     */
    event LogRefundApproval(uint256 amount, uint256 totalRefunded);


    /*----------  Methods  ----------*/

    /**
     * @dev Get available grant balance.
     * @return Balance remaining in contract.
     */
    function getAvailableBalance()
        public
        view
        returns(uint256 balance);

    /**
     * @dev Funding status check.
     * @return true if can fund grant.
     */
    function canFund()
        public
        view
        returns(bool);

    /**
     * @dev Fund a grant proposal.
     * @param value Amount in WEI or GRAINS to fund.
     * @return true if payment successful.
     */
    function fund(uint256 value)
        public
        returns (bool);

    /**
     * @dev Approve payment to a grantee.
     * @param grantee Recipient of payment.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Remaining funding available in this grant.
     */
    function approvePayout(address grantee, uint256 value)
        public;

    /**
     * @dev Withdraws portion of the contract's available balance.
     *      Amount must first be approved by Manager.
     * @param grantee Grantee address to pay.
     * @return true if withdraw successful.
     */
    function withdrawPayout(address grantee, uint256 value)
        public
        returns (bool);

    /**
     * @dev Approve refunding a portion of the contract's available balance.
     *      Refunds are split between donors based on their contribution to totalFunded.
     * @param amount Amount to refund.
     */
    function approveRefund(uint256 amount)
        public;


    /**
     * @dev Withdraws portion of the contract's available balance.
     *      Amount donor receives is proportionate to their funding contribution.
     * @param donor Donor address to refund.
     * @return true if withdraw successful.
     */
    function withdrawRefund(address donor)
        public
        returns(bool);

    /**
     * @dev Cancel grant and enable refunds.
     */
    function cancelGrant()
        public;
}
