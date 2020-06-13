import * as waffle from "ethereum-waffle";
import Grant from "../../build/MangedCappedGrant.json";
import GrantToken from "../../build/GrantToken.json";
import GrantFactory from "../../build/GrantFactory.json";
import { Contract, Wallet } from "ethers";
import { AddressZero, Zero } from "ethers/constants";

const AMOUNTS = [1000];
const TARGET_FUNDING = AMOUNTS.reduce((a, b) => a + b, 0);

async function fixture(provider: any, wallets: Wallet[]) {
  const currentTime = (await provider.getBlock(await provider.getBlockNumber())).timestamp;

  const [granteeWallet, donorWallet, managerWallet, secondDonorWallet, unknownWallet] = wallets;

  const token: Contract = await waffle.deployContract(donorWallet, GrantToken, ["Grant Token", "GT"]);

  const grantFromGranteeWithToken: Contract = await waffle.deployContract(
    granteeWallet,
    Grant,
    [
      [granteeWallet.address], // Grantees 
      AMOUNTS,                 // Allocations
      managerWallet.address,   // Manager address
      token.address,           // Currency
      TARGET_FUNDING,          // Target Funding
      currentTime + 86400,     // Funding deadline
      currentTime + 86400 * 2  // Contract Expiration
    ],
    { gasLimit: 6e6 }
  );

  const grantFromGranteeWithEther: Contract = await waffle.deployContract(
    granteeWallet,
    Grant,
    [
      [granteeWallet.address], // Grantees 
      AMOUNTS,                 // Allocations
      managerWallet.address,   // Manager address
      AddressZero,           // Currency
      TARGET_FUNDING,          // Target Funding
      currentTime + 86400,     // Funding deadline
      currentTime + 86400 * 2  // Contract Expiration
    ],
    { gasLimit: 6e6 }
  );

  const grantFactory: Contract = await waffle.deployContract(donorWallet, GrantFactory, undefined, {
    gasLimit: 6e6
  });

  // Initial token balance.
  await token.mint(donorWallet.address, 1e6);

  const tokenFromManager: Contract = new Contract(token.address, GrantToken.abi, managerWallet);
  const tokenFromGrantee: Contract = new Contract(token.address, GrantToken.abi, granteeWallet);

  const grantFromDonorWithToken: Contract = new Contract(grantFromGranteeWithToken.address, Grant.abi, donorWallet);
  const grantFromDonorWithEther: Contract = new Contract(grantFromGranteeWithEther.address, Grant.abi, donorWallet);
  const grantFromManagerWithToken: Contract = new Contract(grantFromGranteeWithToken.address, Grant.abi, managerWallet);
  const grantFromManagerWithEther: Contract = new Contract(grantFromGranteeWithEther.address, Grant.abi, managerWallet);

  return {
    grantFactory,
    grantFromGranteeWithToken,
    grantFromGranteeWithEther,
    grantFromDonorWithToken,
    grantFromDonorWithEther,
    grantFromManagerWithToken,
    grantFromManagerWithEther,
    tokenFromDonor: token,
    tokenFromGrantee,
    tokenFromManager,
    granteeWallet,
    donorWallet,
    managerWallet,
    secondDonorWallet,
    unknownWallet,
    fundingDeadline: currentTime + 86400,
    contractExpiration: currentTime + 86400 * 2,
    provider,
    TARGET_FUNDING
  };
}


export const helpers = {
    constants: {
        AMOUNTS,
        TARGET_FUNDING
    },
    fixtures: {
        fixture
    }
}