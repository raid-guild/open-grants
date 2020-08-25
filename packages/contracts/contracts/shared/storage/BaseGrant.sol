// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "../interfaces/IBaseGrant.sol";


/**
 * @title Base Grant State Management Contract.
 * @dev State, getters, and setters for BaseGrant.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract BaseGrant is IBaseGrant {

    /*----------  Globals  ----------*/

    /* solhint-disable max-line-length */
    bytes private uri;                            // URI for additional (off-chain) grant details such as description, milestones, etc.
    address private currency;                     // (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
    uint256 private targetFunding;                // (Optional) Funding threshold required to begin releasing funds.
    uint256 private totalPaid;                    // Cumulative funding paid to grantees.
    uint256 private fundingDeadline;              // (Optional) Date after which signal OR funds cannot be sent.
    uint256 private contractExpiration;           // (Optional) Date after which payouts must be complete or anyone can trigger refunds.
    bool private grantCancelled;                  // Flag to indicate when grant is cancelled.
    /* solhint-enable max-line-length */


    /*----------  Shared Getters  ----------*/

    function getUri()
        public
        override
        view
        returns(bytes memory)
    {
        return uri;
    }

    function getContractExpiration()
        public
        override
        view
        returns(uint256)
    {
        return contractExpiration;
    }

    function getFundingDeadline()
        public
        override
        view
        returns(uint256)
    {
        return fundingDeadline;
    }

    function getTargetFunding()
        public
        override
        view
        returns(uint256)
    {
        return targetFunding;
    }

    function getTotalPaid()
        public
        override
        view
        returns(uint256)
    {
        return totalPaid;
    }

    function getGrantCancelled()
        public
        override
        view
        returns(bool)
    {
        return grantCancelled;
    }

    function getCurrency()
        public
        override
        view
        returns(address)
    {
        return currency;
    }

    /*----------  Shared Setters  ----------*/

    function setTotalPaid(uint256 value)
        internal
    {
        totalPaid = value;
    }

    function setUri(bytes memory value)
        internal
    {
        uri = value;
    }

    function setGrantCancelled(bool value)
        internal
    {
        grantCancelled = value;
    }
}
