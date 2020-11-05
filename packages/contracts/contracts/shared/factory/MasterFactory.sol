// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./IFactory.sol";


/**
 * @title Master Factory.
 * @dev Dispatches `create` grant calls to external IFactory by address.
 * @author @NoahMarconi
 */
contract MasterFactory {
    using SafeMath for uint256;


    /*----------  Globals  ----------*/
    uint256 public id = 0;
    mapping(uint256 => address) internal grants;  // Grants mapped by GUID.


    /*----------  Events  ----------*/

    /**
     * @dev Grant creation.
     * @param id Sequential identifier.
     * @param grant Address of newly created grant.
     * @param factory Address of factory which created grant.
     */
    event LogNewGrantFromFactory(uint256 indexed id, address grant, address factory);


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
     * @return Address for this grant.
     */
    /* solhint-enable max-line-length */
    function create(
        address[] memory _grantees,
        uint256[] memory _amounts,
        address _currency,
        bytes32 _uri,
        bytes memory _extraData,
        address _type
    )
        public
        returns (address)
    {

        address grantAddress = IFactory(_type).create(
                _grantees,
                _amounts,
                _currency,
                _uri,
                _extraData
        );

        // Store grant info.
        uint256 grantId = id;
        grants[grantId] = grantAddress;

        // Increment id counter.
        id = id.add(1);

        emit LogNewGrantFromFactory(grantId, grantAddress, _type);

        return grantAddress;
    }

    /**
     * @dev Grant address getter.
     * @param _id Sequential identifier for grant.
     * @return grant address.
     */
    function getGrantAddress(uint256 _id)
        public
        view
        returns(address)
    {
        return grants[_id];
    }


}
