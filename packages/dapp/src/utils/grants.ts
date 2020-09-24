import { Contract, providers, utils } from 'ethers';
import { Metadata, uploadMetadata } from 'utils/ipfs';

import { CONFIG } from '../config';

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
const ZERO_HASH = '0x';

const sort = (
  oldGrantees: Array<string>,
  oldAmounts: Array<number>,
): [Array<string>, Array<number>] => {
  const grantees = oldGrantees.slice();
  const amounts = oldAmounts.slice();

  // combine the arrays:
  const list = [];
  for (let j = 0; j < grantees.length; j += 1)
    list.push({ grantee: grantees[j], amount: amounts[j] });

  // sort:
  list.sort(function compare(a, b) {
    if (a.grantee < b.grantee) return -1;
    if (a.grantee === b.grantee) return 0;
    return 1;
  });

  // separate them back out:
  for (let k = 0; k < list.length; k += 1) {
    grantees[k] = list[k].grantee;
    amounts[k] = list[k].amount;
  }
  return [grantees, amounts];
};

export const createGrant = async (
  ethersProvider: providers.Web3Provider,
  oldGrantees: Array<string>,
  oldAmounts: Array<string>,
  metadata: Metadata,
): Promise<string> => {
  const metadataHash = await uploadMetadata(metadata);
  const [grantees, amounts] = sort(
    oldGrantees.map(g => g.toLowerCase()),
    oldAmounts.map(a => Math.floor(Number(a))),
  );

  const abi = new utils.Interface([
    'function create(address[] _grantees, uint256[] _amounts, address _currency, bytes _uri, bytes _extraData) returns (address)',
    'event LogNewGrant(uint256 indexed id, address[] grantees, uint256[] amounts, address grant)',
  ]);
  const factory = new Contract(
    CONFIG.grantFactory,
    abi,
    ethersProvider.getSigner(),
  );
  const tx = await factory.create(
    grantees,
    amounts,
    ADDRESS_ZERO,
    metadataHash,
    ZERO_HASH,
  );
  await tx.wait();
  const receipt = await ethersProvider.getTransactionReceipt(tx.hash);
  const eventFragment = abi.events[Object.keys(abi.events)[0]];
  const eventTopic = abi.getEventTopic(eventFragment);
  const event = receipt.logs.find(e => e.topics[0] === eventTopic);
  if (event) {
    const decodedLog = abi.decodeEventLog(
      eventFragment,
      event.data,
      event.topics,
    );
    return decodedLog.grant;
  }
  return '';
};
