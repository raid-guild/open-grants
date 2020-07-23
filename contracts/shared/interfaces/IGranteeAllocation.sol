// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi
 */
interface IGranteeAllocation {


    /*----------  Shared Getters  ----------*/

    /**
     * @dev Grantee specific check for remaining allocated funds.
     * @param grantee's address.
     */
    function remainingAllocation(address grantee)
        external
        view
        returns(uint256);


}
