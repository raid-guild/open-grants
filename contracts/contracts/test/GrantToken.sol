// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.7.0;

import "openzeppelin-solidity/contracts/presets/ERC20PresetMinterPauser.sol";


contract GrantToken is ERC20PresetMinterPauser {

    constructor (string memory name, string memory symbol)
        public
        ERC20PresetMinterPauser(name, symbol)
    {

    }
}