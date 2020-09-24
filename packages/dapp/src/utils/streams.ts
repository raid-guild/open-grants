import { Contract, providers, Transaction,utils } from 'ethers';

import { CONFIG } from '../config';

export const createStream = async (
  ethersProvider: providers.Web3Provider,
  beneficiary: string,
  duration: number,
  amount: string,
): Promise<string> => {
  const abi = new utils.Interface([
    'function create(address beneficiary, uint256 start, uint256 duration, bool revocable) payable returns (address)',
    'event LogEtherVestingCreated(uint256 indexed id, address vestingContract)',
  ]);
  const factory = new Contract(
    CONFIG.streamFactory,
    abi,
    ethersProvider.getSigner(),
  );

  const tx = await factory.create(
    beneficiary,
    Math.ceil(new Date().getTime() / 1000), // startTime
    duration,
    true,
    {
      value: utils.parseEther(amount),
    },
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
    return decodedLog.vestingContract;
  }
  return '';
};

export const fundGrant = async (
  ethersProvider: providers.Web3Provider,
  beneficiary: string,
  amount: string,
): Promise<Transaction> => {
  return ethersProvider.getSigner().sendTransaction({
    to: beneficiary,
    value: utils.parseEther(amount),
  });
};
