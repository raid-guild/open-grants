pragma solidity >=0.5.10 <0.6.0;

/**
 * @title Carbonvote-like Signaling Interface.
 * @dev Receives Eth or Token Backed Votes. Vote tally takes place off chain.
 * @author @NoahMarconi @JFickel @ArnaudBrousseau
 */
interface ISignal {

    /**
     * @dev Log Event on receiving a signal.
     * @param id The ID of the grant to signal in favor for.
     * @param signaler Address of signaler.
     * @param token Address of token or NULL for Ether based signal.
     * @param value Number of signals denoted in Token GRAINs or WEI.
     */
    event LogSignal(bytes32 indexed id, address indexed signaler, address indexed token, uint256 value);

    /**
     * @dev Voting Signal Method.
     * @param id The ID of the grant to signal in favor for.
     * @param value Number of signals denoted in Token GRAINs or WEI.
     * @return True if successful, otherwise false.
     */
    function signal(bytes32 id, uint256 value)
        external
        payable
        returns (bool);

    /**
     * @dev End signaling and move to next GrantStatus.
     * @param id The ID of the grant to end signaling for.
     */
    function endSignaling(bytes32 id)
        external
        returns (bool);
}