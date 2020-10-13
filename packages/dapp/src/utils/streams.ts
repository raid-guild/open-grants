import { CONFIG } from 'config';
import { Contract, providers, utils } from 'ethers';

const abi = new utils.Interface([
  'function create(address beneficiary, uint256 start, uint256 duration, bool revocable) payable returns (address)',
  'event LogEtherVestingCreated(uint256 indexed id, address vestingContract)',
]);

export const createStream = async (
  ethersProvider: providers.Web3Provider,
  beneficiary: string,
  duration: number,
  amount: string,
): Promise<providers.TransactionResponse> => {
  const factory = new Contract(
    CONFIG.streamFactory,
    abi,
    ethersProvider.getSigner(),
  );

  return factory.create(
    beneficiary,
    Math.ceil(new Date().getTime() / 1000), // startTime
    duration,
    true,
    {
      value: utils.parseEther(amount),
    },
  );
};

export const awaitStreamAddress = async (
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
    return decodedLog.vestingContract;
  }
  return '';
};

export const fundGrant = async (
  ethersProvider: providers.Web3Provider,
  beneficiary: string,
  amount: string,
): Promise<providers.TransactionResponse> => {
  return ethersProvider.getSigner().sendTransaction({
    to: beneficiary,
    value: utils.parseEther(amount),
  });
};
