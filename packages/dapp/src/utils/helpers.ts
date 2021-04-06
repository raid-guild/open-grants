import { getAddress } from '@ethersproject/address';
import { BigNumber, utils } from 'ethers';
import { Stream } from 'utils/types';

export const getVestedAmount = (
  input: Stream,
  currentTime: number, // in seconds
): BigNumber => {
  if (currentTime >= Number(input.startTime) + Number(input.duration)) {
    return input.funded;
  }
  return input.funded.mul(currentTime - input.startTime).div(input.duration);
};

export const formatValue = (numberInWei: BigNumber, p = 1): string => {
  const etherValue = Number(utils.formatEther(numberInWei));
  const etherRound = Math.round(etherValue * 10 ** p) / 10 ** p;
  return etherRound.toFixed(p);
};

export const sortGranteesByAmount = (
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
  list.sort((a, b) => {
    if (a.amount < b.amount) return 1;
    if (a.amount === b.amount) return 0;
    return -1;
  });

  // separate them back out:
  for (let k = 0; k < list.length; k += 1) {
    grantees[k] = list[k].grantee;
    amounts[k] = list[k].amount;
  }
  return [grantees, amounts];
};

export const sortGrantees = (
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
  list.sort((a, b) => {
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

export const copyToClipboard = (value: string): void => {
  const tempInput = document.createElement('input');
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
};

// returns the checksummed address if the address is valid, otherwise returns false
export const isAddress = (value: string): string | false => {
  try {
    return getAddress(value).toLowerCase();
  } catch {
    return false;
  }
};

export const timeout = (ms: number): Promise<number> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
