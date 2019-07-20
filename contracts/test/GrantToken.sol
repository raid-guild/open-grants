pragma solidity >=0.5.10 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";


contract GrantToken is ERC20Detailed, ERC20Mintable {

    constructor (string memory name, string memory symbol, uint8 decimals)
        public
        ERC20Detailed(name, symbol, decimals)
    {
        // solium-disable-previous-line no-empty-blocks
    }
}