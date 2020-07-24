import { Contract, Signer } from "ethers";
import { Provider } from "ethers/providers";

export const callOnEach = async (fn: (x: any) => Promise<any>, wallets: Signer[]) => {
  let res = [];

  for (let wallet of wallets) {
    const el = await fn(await wallet.getAddress());
    res.push(el);
  }

  return res;
}
  
export const getEtherBalances = async (provider: Provider, wallets: Signer[]) => {
  return await callOnEach((x) => provider.getBalance(x), wallets);
}

export const getGranteesTargetFunding = async (contract: Contract, wallets: Signer[]) => {
  return await callOnEach((x) => contract.getGranteeTargetFunding(x), wallets);
}