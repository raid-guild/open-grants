// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "../interfaces/IDonorFund.sol";

/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi
 */
abstract contract AbstractDonorFund is IDonorFund {

    /*----------  Globals  ----------*/

    mapping(address => uint256) private donorFunded;     // Cumulative amount funded.


    /*----------  Public Getters  ----------*/

    /**
     * @dev Get Donor funded amount by address.
     * @param donor address of donor to get.
     */
    function getDonorFunded(address donor)
        external
        override
        view
        returns(uint256)
    {
        return donorFunded[donor];
    }


    /*----------  Internal Setters  ----------*/

    /**
     * @dev Set Donor funded amount by address.
     * @param donor address of donor to set.
     * @param value value to set.
     */
    function setDonorFunded(address donor, uint256 value)
        internal
    {
        donorFunded[donor] = value;
    }
}