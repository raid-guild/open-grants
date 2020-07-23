// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ManagedCappedGrant.sol";
import "./UnmanagedStream.sol";


/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
contract GrantFactory {
    using SafeMath for uint256;


    /*----------  Globals  ----------*/
    uint256 public id;
    mapping(uint256 => address) internal grants;  // Grants mapped by GUID.


    /**
     * @dev Grant creation.
     * @param id Sequential identifier.
     * @param grant Address of newly created grant.
     */
    event LogNewGrant(uint256 indexed id, address grant);

    /*----------  Methods  ----------*/

    /* solhint-disable max-line-length */
    /**
     * @dev Grant creation function. May be called by grantors, grantees, or any other relevant party.
     * @param _grantees Sorted recipients of unlocked funds.
     * @param _amounts Respective allocations for each Grantee (must follow sort order of _grantees).
     * @param _currency (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
     * @param _uri URI for additional (off-chain) grant details such as description, milestones, etc.
     * @param _extraData Support for extensions to the Standard.
     * @param _type Type of grant contract to create.
     * @return GUID for this grant.
     */
    /* solhint-enable max-line-length */
    function create(
        address[] memory _grantees,
        uint256[] memory _amounts,
        address _currency,
        bytes memory _uri,
        bytes memory _extraData, // solhint-disable-line no-unused-vars
        uint256 _type
    )
        public
        returns (uint256)
    {

        address grantAddress;

        if (_type == 1) {
            ManagedCappedGrant grant = new ManagedCappedGrant(
                _grantees,
                _amounts,
                _currency,
                _uri,
                _extraData
            );

            grantAddress = address(grant);
        } else if (_type == 2) {
            ManagedCappedGrant grant = new ManagedCappedGrant(
                _grantees,
                _amounts,
                _currency,
                _uri,
                _extraData
            );

            grantAddress = address(grant);
        } else if (_type == 3) {
            UnmanagedStream grant = new UnmanagedStream(
                _grantees,
                _amounts,
                _currency,
                _uri,
                _extraData
            );

            grantAddress = address(grant);
        }

        // Store grant info.
        uint256 grantId = id;
        grants[grantId] = grantAddress;

        // Increment id counter.
        id = id.add(1);

        emit LogNewGrant(grantId, grantAddress);

        return grantId;
    }

}
