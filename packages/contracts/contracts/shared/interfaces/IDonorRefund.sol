// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title Refund Interface.
 * @author @NoahMarconi
 */
interface IDonorRefund {

    /*----------  Events  ----------*/

    /**
     * @dev Grant refunding funding.
     * @param donor Address receiving refund.
     * @param value Amount in WEI or ATOMIC_UNITS refunded.
     */
    event LogRefund(address indexed donor, uint256 value);


    /*----------  Public Getters  ----------*/

    /**
     * @dev Get Donor refunded amount by address.
     * @param donor address of donor to get.
     */
    function getDonorRefunded(address donor)
        external
        view
        returns(uint256);

}
