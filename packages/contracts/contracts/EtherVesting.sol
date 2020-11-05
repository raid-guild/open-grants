// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./shared/storage/Funding.sol";

/**
 * @title EtherVesting
 * @dev An ether holder contract that can release its ether balance gradually like a
 * typical vesting scheme, with a vesting period. Optionally revocable by the
 * owner.
 * NOTE: anyone can send ETH to the contract but only the owner or the beneficiary can receive ETH from this contract.
 */
contract EtherVesting is Ownable, ReentrancyGuard, Funding {
    // The vesting schedule is time-based (i.e. using block timestamps as opposed to e.g. block numbers), and is
    // therefore sensitive to timestamp manipulation (which is something miners can do, to a certain degree). Therefore,
    // it is recommended to avoid using short time durations (less than a minute). Typical vesting schemes, with
    // a duration of four years, are safe to use.
    // solhint-disable not-rely-on-time

    using SafeMath for uint256;

    event LogReleased(uint256 amount);
    event LogRevoked();

    // beneficiary of Ether after they are released
    address private _beneficiary;

    // Durations and timestamps are expressed in UNIX time, the same units as block.timestamp.
    uint256 private _start;
    uint256 private _duration;

    bool private _revocable;

    uint256 private _released;
    bool private _revoked;

    /**
     * @dev Creates a vesting contract that vests its balance of Ether to the
     * beneficiary, gradually in a linear fashion until start + duration. By then all
     * of the balance will have vested.
     * @param beneficiary address of the beneficiary to whom vested ether is transferred
     * @param start the time (as Unix time) at which point vesting starts
     * @param duration duration in seconds of the period in which the ether will vest
     * @param revocable whether the vesting is revocable or not
     */
    constructor (address beneficiary, uint256 start, uint256 duration, bool revocable) {
        require(beneficiary != address(0), "EtherVesting: beneficiary is the zero address");
        // solhint-disable-next-line max-line-length
        require(duration > 0, "EtherVesting: duration is 0");
        // solhint-disable-next-line max-line-length
        require(start.add(duration) > block.timestamp, "EtherVesting: final time is before current time");

        _beneficiary = beneficiary;
        _revocable = revocable;
        _duration = duration;
        _start = start;
    }

    /**
     * @return the beneficiary of the ether.
     */
    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    /**
     * @return the start time of the ether vesting.
     */
    function start() public view returns (uint256) {
        return _start;
    }

    /**
     * @return the duration of the ether vesting.
     */
    function duration() public view returns (uint256) {
        return _duration;
    }

    /**
     * @return true if the vesting is revocable.
     */
    function revocable() public view returns (bool) {
        return _revocable;
    }

    /**
     * @return the amount of the ether released.
     */
    function released() public view returns (uint256) {
        return _released;
    }

    /**
     * @return true if the ether is revoked.
     */
    function revoked() public view returns (bool) {
        return _revoked;
    }

    /**
     * @notice Transfers vested ether to beneficiary.
     */
    function release()
        external
        nonReentrant
    {
        uint256 unreleased = _releasableAmount();

        require(unreleased > 0, "EtherVesting: no ether are due");

        _released = _released.add(unreleased);


        (bool success, ) = _beneficiary.call{ value: unreleased}("");
        require(
            success,
            "EtherVesting::Transfer Error. Unable to send unreleased to _beneficiary."
        );

        emit LogReleased(unreleased);
    }

    /**
     * @notice Allows the owner to revoke the vesting. Ether already vested
     * remain in the contract, the rest are returned to the owner.
     */
    function revoke()
        external
        onlyOwner
        nonReentrant
    {
        require(_revocable, "EtherVesting: cannot revoke");
        require(!_revoked, "EtherVesting: ether already revoked");

        uint256 balance = address(this).balance;

        uint256 unreleased = _releasableAmount();
        uint256 refund = balance.sub(unreleased);

        _revoked = true;

        if (refund > 0) {
            (bool success, ) = owner().call{ value: refund}("");
            require(
                success,
                "EtherVesting::Transfer Error. Unable to send refund to owner."
            );
        }

        emit LogRevoked();
    }

    /**
     * @dev Calculates the amount that has already vested but hasn't been released yet.
     */
    function _releasableAmount() private view returns (uint256) {
        return _vestedAmount().sub(_released);
    }

    /**
     * @dev Calculates the amount that has already vested.
     */
    function _vestedAmount() private view returns (uint256) {
        if (block.timestamp <= _start) return 0;

        uint256 currentBalance = address(this).balance;
        uint256 totalBalance = currentBalance.add(_released);

        if (block.timestamp >= _start.add(_duration) || _revoked) {
            return totalBalance;
        } else {
            return totalBalance.mul(block.timestamp.sub(_start)).div(_duration);
        }
    }


    /**
     * @dev Receive ether transfers
     */
    receive()
        external
        payable
        nonReentrant
    {

        require(
            msg.value > 0,
            "fallback::Invalid Value. msg.value must be greater than 0."
        );

        increaseTotalFundingBy(msg.value);

        emit LogFunding(msg.sender, msg.value);
    }
}
