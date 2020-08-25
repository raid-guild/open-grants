// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/IGrantee.sol";
import "../interfaces/IFunding.sol";
import "../interfaces/IGranteeAllocation.sol";
import "../libraries/Percentages.sol";


/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract GranteeAllocation is IGrantee, IGranteeAllocation, IFunding {
    using SafeMath for uint256;

    /*----------  Public Methods  ----------*/

    /**
     * @dev Grantee specific check for remaining allocated funds.
     * @param grantee's address.
     */
    function remainingAllocation(address grantee)
        public
        override
        view
        returns(uint256)
    {

        uint256 remaining;
        uint256 _targetFunding = this.getGranteeTargetFunding(grantee);
        uint256 _payoutApproved = this.getGranteePayoutApproved(grantee);


        if (this.getPercentageBased()) {
            uint256 eligiblePortion = Percentages.maxAllocation(
                _targetFunding,
                this.getCumulativeTargetFunding(),
                this.getTotalFunding()
            );

            remaining = eligiblePortion
            .sub(_payoutApproved);
        } else {
           remaining = _targetFunding
            .sub(_payoutApproved);
        }

        return remaining;
    }
}