// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "./shared/libraries/Percentages.sol";
import "./shared/GranteeConstructor.sol";
import "./shared/storage/AbstractFunding.sol";
import "./shared/storage/AbstractBaseGrant.sol";

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
contract UnmanagedStream is ReentrancyGuard, AbstractBaseGrant, GranteeConstructor, AbstractFunding {


    /*----------  Constructor  ----------*/

    /**
     * @dev Grant creation function. May be called by grantors, grantees, or any other relevant party.
     * @param _grantees Sorted recipients of unlocked funds.
     * @param _amounts Respective allocations for each Grantee (must follow sort order of _grantees).
     * @param _currency (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
     * @param _uri URI for additional (off-chain) grant details such as description, milestones, etc.
     * @param _extraData (Optional) Support for extensions to the Standard.
     */
    constructor(
        address[] memory _grantees,
        uint256[] memory _amounts,
        address _currency,
        bytes memory _uri,
        bytes memory _extraData
    )
        GranteeConstructor(_grantees, _amounts, true)
        public
    {

        require(
            _currency == address(0),
            "constructor::Invalid Argument. Currency must be ADDRESS_ZERO."
        );

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

        uint256 numGrantees = this.getGranteeReferenceLength();
        address lastGrantee = payable(this.getGranteeReference(numGrantees - 1));
        for (uint256 i = 0; i < this.getGranteeReferenceLength(); i++) {
            address payable currentGrantee = payable(this.getGranteeReference(i));

            uint256 eligiblePortion = Percentages.maxAllocation(
                this.getGranteeTargetFunding(currentGrantee),
                this.getCumulativeTargetFunding(),
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
            }

        }

        increaseTotalFundingBy(msg.value);

        emit LogFunding(msg.sender, msg.value);

    }

}
