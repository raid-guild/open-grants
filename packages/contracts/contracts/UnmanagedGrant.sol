// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./shared/libraries/Percentages.sol";
import "./shared/modules/GranteeConstructor.sol";
import "./shared/storage/Funding.sol";
import "./shared/storage/BaseGrant.sol";

/**
 * @title Grant for Eth2.
 * @dev Managed                     (n)
 *      Funding Deadline            (n)
 *      Contract expiry             (n)
 *      With Token                  (n)
 *      Percentage based allocation (y)
 *      Withdraw (pull payment)     (n)
 *      This is a simplified grant which behaves as a simple payment splitter.
 *      No refunds or managers; payment are immediately pushed.
 *      WARNING: vulnerable to sending to Gas Token generating addresses. Trust in grantees not doing so is required.
 * @author @NoahMarconi
 */
contract UnmanagedGrant is ReentrancyGuard, BaseGrant, GranteeConstructor, Funding {


    /*----------  Constructor  ----------*/

    /**
     * @dev Grant creation function. May be called by grantors, grantees, or any other relevant party.
     * @param _grantees Sorted recipients of unlocked funds.
     * @param _amounts Respective allocations for each Grantee (must follow sort order of _grantees).
     * @param _uri URI for additional (off-chain) grant details such as description, milestones, etc.
     */
    constructor(
        address[] memory _grantees,
        uint256[] memory _amounts,
        bytes32 _uri
    )
        GranteeConstructor(_grantees, _amounts, true)
    {

        // Initialize globals.
        setUri(_uri);

    }


    /*----------  Fallback  ----------*/

    receive()
        external
        payable
        nonReentrant
    {

        require(
            msg.value > 0,
            "fallback::Invalid Value. msg.value must be greater than 0."
        );

        uint256 numGrantees = getGranteeReferenceLength();
        address lastGrantee = payable(getGranteeReference(numGrantees - 1));
        for (uint256 i = 0; i < numGrantees; i++) {
            address payable currentGrantee = payable(getGranteeReference(i));

            uint256 eligiblePortion = Percentages.maxAllocation(
                getGranteeTargetFunding(currentGrantee),
                getCumulativeTargetFunding(),
                msg.value
            );

            if (currentGrantee == lastGrantee) {
                // Handle rounding of a few wei.
                // @audit question for auditor, should we enforce this is within expected threshold?
                eligiblePortion = address(this).balance;
            }

            if (eligiblePortion > 0) {
                (bool success, ) = currentGrantee.call{ value: eligiblePortion}("");
                require(
                    success,
                    "fallback::Transfer Error. Unable to send eligiblePortion to Grantee."
                );
                emit LogPayment(currentGrantee, eligiblePortion);
            }

        }

        increaseTotalFundingBy(msg.value);

        emit LogFunding(msg.sender, msg.value);

    }

}
