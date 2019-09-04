pragma solidity >=0.5.10 <0.6.0;

/**
 * @title Carbonvote-like Signaling Interface.
 * @dev Receives Eth or Token Backed Votes. Vote tally takes place off chain.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
interface ISignal {

    /**
     * @dev Log Event on receiving a signal.
     * @param signaler Address of signaler.
     * @param token Address of token or NULL for Ether based signal.
     * @param value Number of signals denoted in Token GRAINs or WEI.
     */
    event LogSignal(address indexed signaler, address indexed token, uint256 value);

    /**
     * @dev Voting Signal Method.
     * @param value Number of signals denoted in Token GRAINs or WEI.
     * @return True if successful, otherwise false.
     */
    function signal( uint256 value)
        external
        payable
        returns (bool);

}