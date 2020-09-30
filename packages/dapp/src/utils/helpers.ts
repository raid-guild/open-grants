import { BigNumber, utils } from 'ethers';

export const formatValue = (numberInWei: BigNumber): string => {
  const etherValue = Number(utils.formatEther(numberInWei));
  const etherRound = Math.round(etherValue * 10) / 10;
  return etherRound.toFixed(1);
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
