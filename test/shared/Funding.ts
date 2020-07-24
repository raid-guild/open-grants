import chai from "chai";
import * as waffle from "ethereum-waffle";
import { Contract, Signer, utils  } from "ethers";

import bre, { ethers } from '@nomiclabs/buidler';
import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
import { bigNumberify } from "ethers/utils";

chai.use(waffle.solidity);
const { expect } = chai;


const fundingWithEther = async (
  fixture: (bre: BuidlerRuntimeEnvironment, contractName: string) => Promise<any>,
  contractName: string
) => {
  describe("Funding - With Ether", async () => {
    let _provider: any;
    let _donors: Signer[];
    let _contract: Contract;
  
    before(async () => {
  
      
      const {
        donors,
        provider,
        contract
      } = await fixture(bre, contractName);
  
  
      _donors = donors;
      _provider = provider;
      _contract = contract;
  
    });

        
    it("should increase totalFunding state variable", async () => {
      const preTotalFunding = await _contract.getTotalFunding();
      await _donors[0].sendTransaction({ to: _contract.address, value: 5 });
      const postTotalFunding = await _contract.getTotalFunding();
      expect(postTotalFunding).to.eq(preTotalFunding.add(bigNumberify(5)));
    });


  });
};

const fundingWithToken = async (
  fixture: (bre: BuidlerRuntimeEnvironment, contractName: string) => Promise<any>,
  contractName: string
) => {
  describe("Funding - With Token", async () => {
    let _donors: Signer[];
    let _contract: Contract;
  
    before(async () => {
  
      
      const {
        donors,
        contract
      } = await fixture(bre, contractName);
  
  
      _donors = donors;
      _contract = contract;
  
    });
        
    it("should increase funding");

  });
};

export const funding = async (
    fixture: (bre: BuidlerRuntimeEnvironment, contractName: string) => Promise<any>,
    currency: string,
    contractName: string
  ) => {
    if (currency === ethers.constants.AddressZero) {
      fundingWithEther(fixture, contractName);
    } else {
      fundingWithToken(fixture, contractName);
    }
  }