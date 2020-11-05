// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi
 */
interface IBaseGrant {

    /*----------  Events  ----------*/

    /**
     * @dev Funding target reached event.
     * implemented in IFunding
     * event LogFundingComplete();
     */

    /**
     * @dev Grant received funding.
     * implemented in IFunding
     * @param donor Address funding the grant.
     * @param value Amount in WEI or ATOMIC_UNITS funded.
     * event LogFunding(address indexed donor, uint256 value);
     */

    /**
     * @dev Grant paying grantee.
     * @param grantee Address receiving payment.
     * @param value Amount in WEI or ATOMIC_UNITS paid.
     */
    event LogPayment(address indexed grantee, uint256 value);


    /*----------  Shared Getters  ----------*/

    /**
     * @dev URI for additional (off-chain) grant details such as description, milestones, etc.
     */
    function getUri()
        external
        view
        returns(bytes32);

    /**
     * @dev If null, amount is in wei, otherwise address of ERC20-compliant contract.
     */
    function getCurrency()
        external
        view
        returns(address);

    /**
     * @dev Funding threshold required to begin releasing funds.
     */
    function getTargetFunding()
        external
        view
        returns(uint256);

    /**
     * @dev Cumulative funding paid to grantees.
     */
    function getTotalPaid()
        external
        view
        returns(uint256);

    /**
     * @dev Date after which signal OR funds cannot be sent.
     */
    function getFundingDeadline()
        external
        view
        returns(uint256);

    /**
     * @dev Date after which payouts must be complete or anyone can trigger refunds.
     */
    function getContractExpiration()
        external
        view
        returns(uint256);

    /**
     * @dev Flag to indicate when grant is cancelled.
     */
    function getGrantCancelled()
        external
        view
        returns(bool);

}
