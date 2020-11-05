// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title Carbonvote-like Signaling Interface.
 * @dev Receives Eth or Token Backed Votes. Vote tally takes place off chain.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
interface ISignal {

    /**
     * @dev Log Event on receiving a signal.
     * @param support true if in support of grant false if opposed.
     * @param signaler Address of signaler.
     * @param token Address of token or NULL for Ether based signal.
     * @param value Number of signals denoted in Token GRAINs or WEI.
     */
    event LogSignal(bool indexed support, address indexed signaler, address indexed token, uint256 value);

    /**
     * @dev Voting Signal Method.
     * @param value Number of signals denoted in Token GRAINs or WEI.
     * @param support true if in support of grant false if opposed.
     * @return true if successful, otherwise false.
     */
    function signal(bool support, uint256 value)
        external
        payable
        returns (bool);

}
