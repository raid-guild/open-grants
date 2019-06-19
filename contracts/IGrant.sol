pragma solidity ^0.5.9;

interface IGrant {
    /*
     * TODO
     */
    function fund() public view returns (uint balance);

    /*
     * TODO
     */
    function vote(uint voteValue) public returns (boolean);

    /*
     * TODO
     */
    function payout() public returns (uint balance);

    /*
     * Returns a tally of votes per value
     * This can be implemented as raw number of votes or ETH for each address
     */
    function votes() public view returns (mapping(uint => uint));

    /*
     * Returns a tally of votes per value
     * This can be implemented as raw number of votes or ETH for each address
     */
    function payout() public returns (boolean);

    // Returns money to grantors, if any
    function abort() public return (boolean);
}
