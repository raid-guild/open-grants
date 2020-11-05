// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../interfaces/IManager.sol";


/**
 * @title Grants Spec Abstract Contract.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi @ameensol @JFickel @ArnaudBrousseau
 */
abstract contract AbstractManager is IManager {

    /*----------  Globals  ----------*/

    address private manager;                      // Multisig or EOA address to manage grant.


    /*----------  Public Helpers  ----------*/

    function requireManager()
        public
        override
        view
    {
        require(
            isManager(msg.sender),
            "requireManager::Permission Error. Function can only be called by manager."
        );
    }

    function isManager(address toCheck)
        public
        override
        view
        returns(bool)
    {
        return manager == toCheck;
    }


    /*----------  Internal Setter  ----------*/

    function setManager(address _manager)
        internal
    {
        require(
            manager == address(0),
            "setManager::Invalid Update. Manager cannot be changed once set."    
        );

        manager = _manager;
    }
}
