pragma solidity ^0.6.0;

import "./EtherVesting.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title EtherVestingFactory
 * @dev Factory Contract to create and track new vesting contracts.
 */
contract EtherVestingFactory {

    using SafeMath for uint256;

    /*----------  Globals  ----------*/
    uint256 public id = 0;
    mapping(uint256 => address) internal _vestingContracts;  // Vesting contracts mapped by GUID.


    /*----------  Events  ----------*/

    event LogEtherVestingCreated(address beneficiary, address vestingContract);


    /*----------  Public Methods  ----------*/

    function create(address beneficiary, uint256 start, uint256 cliffDuration, uint256 duration, bool revocable)
        public
    {
        address vestingAddress;

        EtherVesting vesting = new EtherVesting(
            beneficiary,
            start,
            cliffDuration,
            duration,
            revocable
        );

        vestingAddress = address(vesting);

        // Store grant info.
        uint256 vestingId = id;
        _vestingContracts[vestingId] = vestingAddress;

        // Increment id counter.
        id = id.add(1);

        emit LogEtherVestingCreated(beneficiary, vestingAddress);

        return vestingAddress;
    }


    /**
     * @dev Vesting contract address getter.
     * @param _id Sequential identifier for vesting contract.
     * @return vesting contract address.
     */
    function getVestingAddress(uint256 _id)
        public
        override
        view
        returns(address)
    {
        return _vestingContracts[_id];
    }

}
