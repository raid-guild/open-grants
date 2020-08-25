// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi
 */
interface IFunding {

    /*----------  Events  ----------*/

    /**
     * @dev Funding target reached event.
     */
    event LogFundingComplete();

    /**
     * @dev Grant received funding.
     * @param donor Address funding the grant.
     * @param value Amount in WEI or ATOMIC_UNITS funded.
     */
    event LogFunding(address indexed donor, uint256 value);


    /*----------  Shared Getters  ----------*/

    /**
     * @dev Cumulative funding donated by donors.
     */
    function getTotalFunding()
        external
        view
        returns(uint256);


}
