// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

/**
 * @title Manager Interface.
 * @author @NoahMarconi
 */
interface IManager {

    /*----------  Public Helpers  ----------*/

    function isManager(address toCheck)
        external
        view
        returns(bool);

    function requireManager()
        external
        view;

}
