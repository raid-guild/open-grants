import { CONFIG } from 'config';
import { Contract, providers, utils } from 'ethers';
import { getGrant } from 'graphql/getGrant';
import { sortGrantees, timeout } from 'utils/helpers';
import { uploadMetadata } from 'utils/ipfs';
import { GrantMetadata } from 'utils/types';

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
const ZERO_HASH = '0x';

const abi = new utils.Interface([
  'function create(address[] _grantees, uint256[] _amounts, address _currency, bytes32 _uri, bytes _extraData) returns (address)',
  'event LogNewGrant(uint256 indexed id, address[] grantees, uint256[] amounts, address grant)',
]);

export const createGrant = async (
  ethersProvider: providers.Web3Provider,
  oldGrantees: Array<string>,
  oldAmounts: Array<string>,
  metadata: GrantMetadata,
): Promise<providers.TransactionResponse> => {
  const metadataHash = await uploadMetadata(metadata);
  const [grantees, amounts] = sortGrantees(
    oldGrantees.map(g => g.toLowerCase()),
    oldAmounts.map(a => Math.floor(Number(a) * 100)),
  );

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

export const fetchGrantAddressFromNetwork = async (
  ethersProvider: providers.Web3Provider,
  tx: providers.TransactionResponse,
): Promise<string> => {
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
    return decodedLog.grant.toLowerCase();
  }
  return '';
};

export const awaitGrantAddress = async (
  ethersProvider: providers.Web3Provider,
  tx: providers.TransactionResponse,
): Promise<string> => {
  const grantAddress = await fetchGrantAddressFromNetwork(ethersProvider, tx);
  let grant = await getGrant(grantAddress);
  if (!grant) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      timeout(2000);
      // eslint-disable-next-line no-await-in-loop
      grant = await getGrant(grantAddress);
      if (grant) {
        break;
      }
    }
  }
  return grantAddress;
};
