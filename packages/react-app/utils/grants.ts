import { Contract, providers,Transaction } from 'ethers';

import { CONFIG } from '../config';

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
const ZERO_HASH = '0x';

export const createGrant = async (
  ethersProvider: providers.Web3Provider,
  grantees: Array<string>,
  amounts: Array<string>,
  metadataHash: string,
): Promise<Transaction> => {
  const abi = [
    'function create(address[] _grantees, uint256[] _amounts, address _currency, bytes _uri, bytes _extraData) returns (address)',
  ];
  const factory = new Contract(
    CONFIG.grantFactory,
    abi,
    ethersProvider.getSigner(),
  );

  return factory.create(
    grantees,
    amounts,
    ADDRESS_ZERO,
    metadataHash,
    ZERO_HASH,
  );
};
