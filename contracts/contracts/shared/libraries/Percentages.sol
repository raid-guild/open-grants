// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "./abdk-libraries/ABDKMathQuad.sol";

/**
 * @title Percentage Helpers for Grant Contracts.
 * @dev   Used to offer pro-rata refunds and proportionate payment splitting among grantees
 *        without loss of precision when handling tokens with large supply.
 * @author @NoahMarconi
 */
library Percentages {

    /**
     * @dev Calculate quad point percentage from two uint256 values.
     * @param numerator division numerator.
     * @param denominator division denominator.
     */
    function percentage(uint256 numerator, uint256 denominator)
        internal
        pure
        returns (bytes16)
    {
        bytes16 num = ABDKMathQuad.fromUInt(numerator);
        bytes16 den = ABDKMathQuad.fromUInt(denominator);

        return ABDKMathQuad.div(num, den);
    }

    /**
     * @dev Multiply a quad point percentage by a uint256 value.
     * @param percent percent of total.
     * @param total total to get percent value from.
     */
    function percentTimesTotal(bytes16 percent, uint256 total)
        internal
        pure
        returns (uint256)
    {
        bytes16 tot = ABDKMathQuad.fromUInt(total);
        bytes16 res = ABDKMathQuad.mul(tot, percent);

        return ABDKMathQuad.toUInt(res);
    }

    /**
     * @dev Determine the maxiumum allocation for a Donor or Grantee.
     * @param contribution their contribution to total.
     * @param totalPool total pool to derive percentage owed from.
     * @param remainingPool remaining pool to split between Donors or Grantees.
     */
    function maxAllocation(uint256 contribution, uint256 totalPool, uint256 remainingPool)
        internal
        pure
        returns (uint256)
    {
        bytes16 contributionPercent = Percentages.percentage(
            contribution,
            totalPool
        );

        uint256 contributionMaxAllocation = Percentages.percentTimesTotal(
            contributionPercent,
            remainingPool
        );

        return contributionMaxAllocation;
    }
}