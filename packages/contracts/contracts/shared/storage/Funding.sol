// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/IFunding.sol";


/**
 * @title Total Funding.
 * @dev Handles state for tracking contract total amount funded.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract Funding is IFunding {
    using SafeMath for uint256;


    /*----------  Globals  ----------*/

    /* solhint-disable max-line-length */
    uint256 private totalFunding;                 // Cumulative funding donated by donors.
    /* solhint-enable max-line-length */


    /*----------  Shared Getters  ----------*/

    /**
     * @dev Cumulative funding donated by donors.
     */
    function getTotalFunding()
        external
        override
        view
        returns(uint256)
    {
        return totalFunding;
    }


    /*----------  Shared Setters  ----------*/

    /**
     * @dev Increase cumulative funding donated by donors.
     * @param value amount to increase total funding by.
     */
    function increaseTotalFundingBy(uint256 value)
        internal
    {
        totalFunding = totalFunding.add(value);
    }

    function setTotalFunding(uint256 value)
        internal
    {
        totalFunding = value;
    }

}
