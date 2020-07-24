import chai from "chai";
import * as waffle from "ethereum-waffle";
import { Contract, Signer, utils  } from "ethers";

import bre from '@nomiclabs/buidler';
import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';

chai.use(waffle.solidity);
const { expect } = chai;

import { getGranteesTargetFunding } from "./helpers";


export const granteeConstructorTests = async (
    fixture: (bre: BuidlerRuntimeEnvironment, contractName: string) => Promise<any>,
    amounts: number[],
    percentageBased: boolean,
    contractName: string
  ) => {
    describe("GranteeConstructor - Constructor Tests", async () => {
      const SUM_OF_AMOUNTS = amounts.reduce((x, y) => x + y);    
      let _grantees: Signer[];
      let _donors: Signer[];
      let _provider: any;
      let _contract: Contract;
    
      before(async () => {
    
        const {
          donors,
          grantees,
          provider,
          contract
        } = await fixture(bre, contractName);
    
    
        _grantees = grantees;
        _donors = donors;
        _provider = provider;
        _contract = contract;
    
      });

      it("should record correct grantee references", async () => {
        expect(await _contract.getGranteeReferenceLength()).to.eq(_grantees.length);

        for (let i = 0; i < _grantees.length; i += 1) {
          expect(await _contract.getGranteeReference(i)).to.eq(await _grantees[i].getAddress());
        }
    
      });
  
      it("should record correct grantee amounts", async () => {
  
        const granteeTargetFunding = await getGranteesTargetFunding(_contract, _grantees);
    
        for (let i = 0; i < granteeTargetFunding.length; i += 1) {
          expect(granteeTargetFunding[i]).to.eq(amounts[i]);
        }
    
      });
    
      it("should record correct CumulativeTargetFunding", async () => {
        const cumulativeTargetFunding = await _contract.getCumulativeTargetFunding();
        expect(cumulativeTargetFunding).to.eq(SUM_OF_AMOUNTS);
      });
    
      it("should record percentageBased as true", async () => {
        const _percentageBased = await _contract.getPercentageBased();
        expect(_percentageBased).to.be.equal(percentageBased);
      });
    
    });
  }