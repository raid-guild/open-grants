// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../../UnmanagedGrant.sol";
import "./IFactory.sol";


/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
contract UnmanagedGrantFactory is IFactory {
    using SafeMath for uint256;


    /*----------  Globals  ----------*/
    uint256 public id = 0;
    mapping(uint256 => address) internal grants;  // Grants mapped by GUID.


    /*----------  Methods  ----------*/

    /* solhint-disable max-line-length */
    /**
     * @dev Grant creation function. May be called by grantors, grantees, or any other relevant party.
     * @param _grantees Sorted recipients of unlocked funds.
     * @param _amounts Respective allocations for each Grantee (must follow sort order of _grantees).
     * @param _currency (Optional) If null, amount is in wei, otherwise address of ERC20-compliant contract.
     * @param _uri URI for additional (off-chain) grant details such as description, milestones, etc.
     * @param _extraData Support for extensions to the Standard.
     * @return Address for this grant.
     */
    /* solhint-enable max-line-length */
    function create(
        address[] memory _grantees,
        uint256[] memory _amounts,
        address _currency,
        bytes32 _uri,
        bytes memory _extraData 
    )
        public
        override
        returns (address)
    {

        require(
            _currency == address(0),
            "constructor::Invalid Argument. Currency must be ADDRESS_ZERO."
        );

        address grantAddress;

        UnmanagedGrant grant = new UnmanagedGrant(
            _grantees,
            _amounts,
            _uri
        );

        grantAddress = address(grant);

        // Store grant info.
        uint256 grantId = id;
        grants[grantId] = grantAddress;

        // Increment id counter.
        id = id.add(1);

        emit LogNewGrant(grantId, _grantees, _amounts, grantAddress);

        return grantAddress;
    }

    /**
     * @dev Grant address getter.
     * @param _id Sequential identifier for grant.
     * @return grant address.
     */
    function getGrantAddress(uint256 _id)
        public
        override
        view
        returns(address)
    {
        return grants[_id];
    }

}
