// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi
 */
interface IDonorFund {

    /*----------  Public Getters  ----------*/

    /**
     * @dev Get Donor funded amount by address.
     * @param donor address of donor to get.
     */
    function getDonorFunded(address donor)
        external
        view
        returns(uint256);


}
