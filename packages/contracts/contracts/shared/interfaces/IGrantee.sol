// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi
 */
interface IGrantee {


    /*----------  Global Variable Getters  ----------*/

   /**
     * @dev  Overall funding target for all grantees combined.
     */
    function getCumulativeTargetFunding()
        external
        view
        returns(uint256);

    /**
     * @dev  Grantee amounts are percentage based (if true) or fixed (if false).
     */
    function getPercentageBased()
        external
        view
        returns(bool);

    /*----------  Shared Getters  ----------*/

    /**
     * @dev Get number of grantees.
     * @return number of grantees.
     */
    function getGranteeReferenceLength()
        external
        view
        returns(uint256);

    /**
     * @dev Get grantee address by index.
     * @param index index of grantee to get.
     * @return grantee address.
     */
    function getGranteeReference(uint256 index)
        external
        view
        returns(address);

    /**
     * @dev Get grantee target funding by address.
     * @param grantee address of grantee to set.
     * @return target funding.
     */
    function getGranteeTargetFunding(address grantee)
        external
        view
        returns(uint256);

    /**
     * @dev Get grantee total amount paid by address.
     * @param grantee address of grantee to set.
     * @return total paid.
     */
    function getGranteeTotalPaid(address grantee)
        external
        view
        returns(uint256);

    /**
     * @dev Get grantee payout approved paid by address.
     * @param grantee address of grantee to set.
     * @return payout approved.
     */
    function getGranteePayoutApproved(address grantee)
        external
        view
        returns(uint256);

}
