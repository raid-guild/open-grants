// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface IFactory {

    /**
     * @dev Grant creation.
     * @param id Sequential identifier.
     * @param grant Address of newly created grant.
     */
    event LogNewGrant(uint256 indexed id, address[] grantees, uint256[] amounts, address grant);


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
        address[] calldata _grantees,
        uint256[] calldata _amounts,
        address _currency,
        bytes32 _uri,
        bytes calldata _extraData
    )
        external
        returns (address);

    /**
     * @dev Grant address getter.
     * @param _id Sequential identifier for grant.
     * @return grant address.
     */
    function getGrantAddress(uint256 _id)
        external
        view
        returns(address);

}
