// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Grant.sol";


/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
contract GrantFactory {
    using SafeMath for uint256;


    /*----------  Globals  ----------*/
    uint256 id;
    mapping(uint256 => address) internal grants;  // Grants mapped by GUID.


    /**
     * @dev Grant creation.
     * @param id Sequential identifier.
     * @param grant Address of newly created grant.
     */
    event LogNewGrant(uint256 indexed id, address grant);

    /*----------  Methods  ----------*/

    /**
     * @dev Grant creation function. May be called by grantors, grantees, or any other relevant party.
     * @param _grantees Sorted recipients of unlocked funds.
     * @param _amounts Respective allocations for each Grantee (must follow sort order of _grantees).
     * @param _manager (Optional) Multisig or EOA address of grant manager.
     * @param _currency (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
     * @param _targetFunding (Optional) Funding threshold required to release funds.
     * @param _fundingDeadline (Optional) Block number after which votes OR funds (dependant on GrantType) cannot be sent.
     * @param _contractExpiration (Optional) Block number after which payouts must be complete or anyone can trigger refunds.
     * @param _extraData Support for extensions to the Standard.
     * @return GUID for this grant.
     */
    function create(
        address[] memory _grantees,
        uint256[] memory _amounts,
        address _manager,
        address _currency,
        uint256 _targetFunding,
        uint256 _fundingDeadline,
        uint256 _contractExpiration,
        bytes memory _extraData // implementation detail
    )
        public
        returns (uint256)
    {
        Grant grant = new Grant(
            _grantees,
            _amounts,
            _manager,
            _currency,
            _targetFunding,
            _fundingDeadline,
            _contractExpiration
        );

        // Store grant info.
        uint256 grantId = id;
        address grantAddress = address(grant);
        grants[grantId] = grantAddress;

        // Increment id counter.
        id = id.add(1);

        emit LogNewGrant(grantId, grantAddress);

        return grantId;
    }

}
