pragma solidity >=0.5.10 <0.6.0;

/**
 * @title Carbonvote-like Signaling Interface.
 * @dev Receives Eth or Token Backed Votes. Vote tally takes place off chain.
 * @author @NoahMarconi @JFickel @ArnaudBrousseau
 */
interface ISignal {

    /**
     * @dev Log Event on receiving a vote.
     * @param voter Address of voter.
     * @param token Address of token or NULL for Ether based vote.
     * @param value Number of votes denoted in Token GRAINs or WEI.
     */
    event LogVote(address indexed voter, address indexed token, uint256 value);

    /**
     * @dev Voting Signal Method.
     * @param id The ID of the grant to vote in favor for.
     * @param token Address of token or NULL for Ether based vote.
     * @param value Number of votes denoted in Token GRAINs or WEI.
     * @return True if successful, otherwise false.
     */
    function signal(bytes32 id, address token, uint256 value)
        external
        payable
        returns (bool);
}