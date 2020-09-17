import chai from 'chai';
import * as waffle from 'ethereum-waffle';
import { Contract, Signer, utils } from 'ethers';

import bre from '@nomiclabs/buidler';
import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';

chai.use(waffle.solidity);
const { expect } = chai;

export const baseGrantConstructorTests = async (
  fixture: (
    bre: BuidlerRuntimeEnvironment,
    contractName: string,
  ) => Promise<any>,
  uri: string,
  currency: string,
  targetFunding: number,
  fundingDeadline: number,
  contractExpiration: number,
  contractName: string,
) => {
  describe('BaseGrant - Constructor Tests', async () => {
    let _provider: any;
    let _contract: Contract;

    before(async () => {
      const { provider, contract } = await fixture(bre, contractName);

      _provider = provider;
      _contract = contract;
    });

    it('should record correct URI', async () => {
      const _uri = await _contract.getUri();
      expect(utils.toUtf8String(_uri)).to.eq(uri);
    });

    it('should record correct currency', async () => {
      const _currency = await _contract.getCurrency();
      expect(_currency).to.eq(currency);
    });

    it('should record correct targetFunding', async () => {
      const _targetFunding = await _contract.getTargetFunding();
      expect(_targetFunding).to.eq(targetFunding);
    });

    it('should record correct fundingDeadline', async () => {
      const _fundingDeadline = await _contract.getFundingDeadline();
      expect(_fundingDeadline).to.eq(fundingDeadline);
    });

    it('should record correct contractExpiration', async () => {
      const _contractExpiration = await _contract.getContractExpiration();
      expect(_contractExpiration).to.eq(contractExpiration);
    });

    it('should be initialized as not cancelled', async () => {
      const _grantCancelled = await _contract.getGrantCancelled();
      expect(_grantCancelled).to.be.false;
    });
  });
};
