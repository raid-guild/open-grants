pragma solidity ^0.5.9;

contract Grant is IGrant {
    using SafeMath for uint256;

    enum States { Funding, Voting, Aborted, Finalized }
    States _state;

    // receiving unlocked funds in order of priority
    // Each grantee has an amount associated with it.
    mapping(address => uint256) grantees;

    // Keep track of the money in the grant
    mapping(address=>uint256) grantors

    // Keep track of the votes
    mapping(address => uint) votes;


    // Owner of account approves the transfer of an amount to another account
    mapping(address => mapping (address => uint256)) allowed;

    // Is that needed?
    address currency;

    uint256 expiration;

    /**
     * TODO
     * We should really use some sort of escrow contract here:
     * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/crowdsale/Crowdsale.sol
     * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/payment/escrow/Escrow.sol
     * Do we actually want to couple funding and voting?
     * There's probably an argument for having separate contracts for signaling vs funding. Or maybe it needs to happen in several phases
     */
    function fund() public view returns (uint balance) {
        // TODO: if funded correctly, transition state to "Voting"
        _state = States.Voting;
    }

    /**
     * TODO
     */
    function vote(uint voteValue) public returns (boolean) {
        // TODO: check that the state is Voting
    }

    /**
     * Returns a tally of votes per value
     * This can be implemented as raw number of votes or ETH for each address
     */
    function votes() public view returns (mapping(uint => uint)) {
        // for address in mapping do
        //   call _count_vote(address, vote_value)
        // done
    }

    /**
     * Should be overriden if needed.
     * This is where custom logic can be inserted to tally votes based on funds
     * in an address.
     */
    function _count_vote(address voter, uint value) returns (uint) {
        return value;
    }

    /**
     * TODO
     * How is this triggered? What does it do exactly?
     */
    function payout() public returns (boolean) {
        // Check that state is Voting and that we're past the expiration
        _state = States.Finalized;
    }

    /**
     * TODO: Returns money to grantors, if any
     * TODO: make sure this is only runnable by the contract creator
     */
    function abort() public return (boolean) {
        _state = States.Aborted;
    }
}
