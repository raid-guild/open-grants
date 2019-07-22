pragma solidity >=0.5.10 <0.6.0;
pragma experimental ABIEncoderV2;

import "./AbstractGrant.sol";


/**
 * @title Fund Threshold.
 * @dev Threshold based grant methods.
 *      Controls funding for grants when GrantType is threshold based.
 * @author @NoahMarconi @JFickel @ArnaudBrousseau
 */
contract FundThreshold is AbstractGrant {

    /**
     * @dev Fund a grant proposal.
     * @param id GUID for the grant to fund.
     * @param value Amount in WEI or GRAINS to fund.
     * @return Cumulative funding received for this grant.
     */
    function fund(bytes32 id, uint256 value)
        public
        payable
        returns (uint256 balance)
    {
        require(
            _grants[id].grantStatus == GrantStatus.FUND,
            "fund::Status Error. Must be GrantStatus.FUND to fund."
        );

        // When threshold met, move to payment stage.
        if (_grants[id].totalFunded >= _grants[id].targetFunding) {
            _grants[id].grantStatus = GrantStatus.PAY;
            emit LogStatusChange(id, GrantStatus.PAY);
        }

        return _grants[id].totalFunded;
    }
}