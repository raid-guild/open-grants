// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/**
 * @title Token Interface.
 * @dev Grant request, funding, and management.
 * @author @NoahMarconi
 */
interface ITrustedToken is IERC20 {
    function decimals() external view returns (uint8);
}
