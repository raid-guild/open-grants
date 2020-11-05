// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../storage/Grantee.sol";

contract GranteeConstructor is Grantee {
    using SafeMath for uint256;

    /*----------  Constructor  ----------*/

    /**
     * @dev Grant creation function. May be called by donors, grantees, or any other relevant party.
     * @param _grantees Sorted recipients of donated funds.
     * @param _amounts Respective allocations for each Grantee (must follow sort order of _grantees).
     * @param _percentageBased Grantee amounts are percentage based (if true) or fixed (if false).
     */
    constructor(
        address[] memory _grantees,
        uint256[] memory _amounts,
        bool _percentageBased
    )
    {

        require(
            _grantees.length > 0,
            "constructor::Invalid Argument. Must have one or more grantees."
        );

        require(
            _grantees.length == _amounts.length,
            "constructor::Invalid Argument. _grantees.length must equal _amounts.length"
        );


        // Initialize Grantees.
        address lastAddress = address(0);
        uint256 _cumulativeTargetFunding = 0;
        for (uint256 i = 0; i < _grantees.length; i++) {
            address currentGrantee = _grantees[i];
            uint256 currentAmount = _amounts[i];

            require(
                currentAmount > 0,
                "constructor::Invalid Argument. currentAmount must be greater than 0."
            );

            require(
                currentGrantee != address(0),
                "constructor::Invalid Argument. grantee address cannot be a ADDRESS_ZERO."
            );

            require(
                currentGrantee > lastAddress,
                "constructor::Invalid Argument. Duplicate or out of order _grantees."
            );


            lastAddress = currentGrantee;
            setGranteeTargetFunding(currentGrantee, currentAmount);

            _cumulativeTargetFunding = _cumulativeTargetFunding.add(currentAmount);

            // Store address as reference.
            addGranteeReference(currentGrantee);
        }

        setCumulativeTargetFunding(_cumulativeTargetFunding);
        setPercentageBased(_percentageBased);

    }

}
