// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "../interfaces/IGrantee.sol";


/**
 * @title Grantee State Management Contract.
 * @dev State, getters, and setters for Grantees.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract Grantee is IGrantee {

    /*----------  Globals  ----------*/

    mapping(address => uint256) private granteeTargetFunding;  // Funding amount targeted for Grantee.
    mapping(address => uint256) private granteeTotalPaid;      // Cumulative funding received by Grantee.
    mapping(address => uint256) private granteePayoutApproved; // Pending payout approved by Manager.

    address[] private granteeReference;                        // Reference to grantee addresses to allow for iterating over grantees.

    uint256 private cumulativeTargetFunding;                   // Denominator for calculating grantee's percentage.
    bool private percentageBased = false;                      // Grantee amounts are percentage based (if true) or fixed (if false).



    /*----------  Global Variable Getters  ----------*/

   /**
     * @dev  Overall funding target for all grantees combined.
     */
    function getCumulativeTargetFunding()
        external
        view
        override
        returns(uint256)
    {
        return cumulativeTargetFunding;
    }

    /**
     * @dev  Grantee amounts are percentage based (if true) or fixed (if false).
     */
    function getPercentageBased()
        external
        view
        override
        returns(bool)
    {
        return percentageBased;
    }

    /*----------  Global Variable Setters  ----------*/

    /**
     * @dev  Overall funding target for all grantees combined.
     * @param value cumulative target funding to set.
     */
    function setPercentageBased(bool value)
        internal
    {
        percentageBased = value;
    }

    /**
     * @dev  Set grantee targets as either fixed or percentage based.
     * @param value cumulative target funding to set.
     */
    function setCumulativeTargetFunding(uint256 value)
        internal
    {
        cumulativeTargetFunding = value;
    }


    /*----------  Grantee Getters  ----------*/

    /**
     * @dev Get number of grantees.
     * @return number of grantees.
     */
    function getGranteeReferenceLength()
        external
        override
        view
        returns(uint256)
    {
        return granteeReference.length;
    }

    /**
     * @dev Get grantee address by index.
     * @param index index of grantee to get.
     * @return grantee address.
     */
    function getGranteeReference(uint256 index)
        external
        override
        view
        returns(address)
    {
        return granteeReference[index];
    }

    /**
     * @dev Get grantee target funding by address.
     * @param grantee address of grantee to set.
     * @return target funding.
     */
    function getGranteeTargetFunding(address grantee)
        external
        override
        view
        returns(uint256)
    {
        return granteeTargetFunding[grantee];
    }

    /**
     * @dev Get grantee total amount paid by address.
     * @param grantee address of grantee to set.
     * @return total paid.
     */
    function getGranteeTotalPaid(address grantee)
        external
        override
        view
        returns(uint256)
    {
        return granteeTotalPaid[grantee];
    }

    /**
     * @dev Get grantee payout approved paid by address.
     * @param grantee address of grantee to set.
     * @return payout approved.
     */
    function getGranteePayoutApproved(address grantee)
        external
        override
        view
        returns(uint256)
    {
        return granteePayoutApproved[grantee];
    }

    /*----------  Grantee Setters  ----------*/


    /**
     * @dev Add grantee address to reference array.
     * @param grantee grantee address to add.
     */
    function addGranteeReference(address grantee)
        internal
    {
        return granteeReference.push(grantee);
    }

    /**
     * @dev Set grantee target funding by address.
     * @param grantee address of grantee to set.
     * @param value target funding to set.
     */
    function setGranteeTargetFunding(address grantee, uint256 value)
        internal
    {
        granteeTargetFunding[grantee] = value;
    }

    /**
     * @dev Set grantee total amount paid by address.
     * @param grantee address of grantee to set.
     * @param value total paid to set.
     */
    function setGranteeTotalPaid(address grantee, uint256 value)
        internal
    {
        granteeTotalPaid[grantee] = value;
    }

    /**
     * @dev Set grantee payout approved paid by address.
     * @param grantee address of grantee to set.
     * @param value payout approved to set.
     */
    function setGranteePayoutApproved(address grantee, uint256 value)
        internal
    {
        granteePayoutApproved[grantee] = value;
    }

}