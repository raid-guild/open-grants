import chai from "chai";
import chaiAlmost from "chai-almost";
import * as waffle from "ethereum-waffle";
import { Contract, Signer, utils  } from "ethers";
import { Provider } from "ethers/providers";
import { BigNumber } from "ethers/utils/bignumber";

import bre from '@nomiclabs/buidler';
import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
import { AddressZero } from "ethers/constants";

chai.use(waffle.solidity);
chai.use(chaiAlmost(1/10**16));
const { expect, assert } = chai;

// Constants.
const URI = '/orbitdb/Qmd8TmZrWASypEp4Er9tgWP4kCNQnW4ncSnvjvyHQ3EVSU/';
const AMOUNTS = [150, 456, 111, 23];
const SUM_OF_AMOUNTS = AMOUNTS.reduce((x, y) => x + y);
const FUND_AMOUNT = utils.parseEther('5');


async function callOnEach(fn: (x: any) => Promise<any>, wallets: Signer[]) {
  let res = [];

  for (let wallet of wallets) {
    const el = await fn(await wallet.getAddress());
    res.push(el);
  }

  return res;
}

async function getEtherBalances(provider: Provider, wallets: Signer[]) {
  return await callOnEach((x) => provider.getBalance(x), wallets);
}

async function getGranteesTargetFunding(contract: Contract, wallets: Signer[]) {
  return await callOnEach((x) => contract.getGranteeTargetFunding(x), wallets);
}

async function fixture(bre: BuidlerRuntimeEnvironment) {
  const provider = bre.waffle.provider;
  const ethers = bre.ethers;
  const { AddressZero } = ethers.constants;

  // Capture and sort wallets.
  let wallets = await bre.ethers.signers();
  let addresses = await wallets.map(async (x, i) => {
    return {
      signer: x,
      i,
      address: await x.getAddress()
    }
  });
  let sortedAddresses = (await Promise.all(addresses)).sort((x, y) => x.address > y.address ? 1 : -1);
  wallets = sortedAddresses.map(x => x.signer);
  const [
    donorWallet0,
    donorWallet1,
    granteeWallet0,
    granteeWallet1,
    granteeWallet2,
    granteeWallet3    
  ] = wallets;

  // Prepare contract.
  const UnmanagedStream = await ethers.getContractFactory("UnmanagedStream");
  const constructorGrantees = [
    await granteeWallet0.getAddress(),
    await granteeWallet1.getAddress(),
    await granteeWallet2.getAddress(),
    await granteeWallet3.getAddress(),
  ]

  // Deploy.
  const unmanagedStream = await UnmanagedStream.deploy(
    constructorGrantees,                // Grantees 
    AMOUNTS,                            // Allocations
    AddressZero,                        // Currency
    bre.ethers.utils.toUtf8Bytes(URI),  // URI
    "0x0",                              // extraData
    );
    
  // Await Deploy.
  await unmanagedStream.deployed();

  return {
    donors: [
      donorWallet0,
      donorWallet1
    ],
    grantees: [
      granteeWallet0,
      granteeWallet1,
      granteeWallet2,
      granteeWallet3
    ],
    provider,
    contract: unmanagedStream
  };
}

async function constructorTests(amounts: number[]) {
  describe("Constructor Tests", async () => {
    const SUM_OF_AMOUNTS = AMOUNTS.reduce((x, y) => x + y);    
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
      } = await fixture(bre);
  
  
      _grantees = grantees;
      _donors = donors;
      _provider = provider;
      _contract = contract;
  
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
      const percentageBased = await _contract.getPercentageBased();
      expect(percentageBased).to.be.true;
    });
  
    it("should record correct currency", async () => {
      const currency = await _contract.getCurrency();
      expect(currency).to.eq(AddressZero);
    });
  
    it("should record correct URI", async () => {
      const uri = await _contract.getUri();
      expect(utils.toUtf8String(uri)).to.eq(URI);
    });
  });
}

describe("Unmanaged-Stream", () => {

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
    } = await fixture(bre);


    _grantees = grantees;
    _donors = donors;
    _provider = provider;
    _contract = contract;

  });

  describe("With Ether", () => {

    constructorTests(AMOUNTS);

    describe("sending funds", () => {
      let _granteeBalance0: BigNumber;
      let _granteeBalance1: BigNumber;
      let _granteeBalance2: BigNumber;
      let _granteeBalance3: BigNumber;

      before(async () => {

      const [
          granteeBalance0,
          granteeBalance1,
          granteeBalance2,
          granteeBalance3
        ] = await getEtherBalances(_provider, _grantees);

        _granteeBalance0 = granteeBalance0;
        _granteeBalance1 = granteeBalance1;
        _granteeBalance2 = granteeBalance2;
        _granteeBalance3 = granteeBalance3;

        await _donors[0].sendTransaction({ to: _contract.address, value: FUND_AMOUNT });
      });

      it("should split funds correctly", async () => {

        // New balances.
        const [
          newGranteeBalance0,
          newGranteeBalance1,
          newGranteeBalance2,
          newGranteeBalance3
        ] = await getEtherBalances(_provider, _grantees);

        // Delta original balances to new balances.
        const granteeBalanceDelta0 = newGranteeBalance0.sub(_granteeBalance0);
        const granteeBalanceDelta1 = newGranteeBalance1.sub(_granteeBalance1);
        const granteeBalanceDelta2 = newGranteeBalance2.sub(_granteeBalance2);
        const granteeBalanceDelta3 = newGranteeBalance3.sub(_granteeBalance3);

        // Expected share of fund amount.
        const pctTimesTotal = (num: number) => ((num / SUM_OF_AMOUNTS) * parseInt(utils.formatEther(FUND_AMOUNT)));
        const granteeExpectedBalance0 = pctTimesTotal(AMOUNTS[0]);
        const granteeExpectedBalance1 = pctTimesTotal(AMOUNTS[1]);
        const granteeExpectedBalance2 = pctTimesTotal(AMOUNTS[2]);
        const granteeExpectedBalance3 = pctTimesTotal(AMOUNTS[3]);

        // Contract Balance should be 0
        expect((await _provider.getBalance(await _contract.address)).toNumber()).to.be.equal(0);

        // CAUTION: Testing to 16 decimal places only (using almost.equal).
        expect(parseFloat(utils.formatEther(granteeBalanceDelta0))).to.almost.equal(granteeExpectedBalance0);
        expect(parseFloat(utils.formatEther(granteeBalanceDelta1))).to.almost.equal(granteeExpectedBalance1);
        expect(parseFloat(utils.formatEther(granteeBalanceDelta2))).to.almost.equal(granteeExpectedBalance2);
        expect(parseFloat(utils.formatEther(granteeBalanceDelta3))).to.almost.equal(granteeExpectedBalance3);

      });

      it("should update totalFunding global", async () => {
        const totalFunding = await _contract.getTotalFunding();
        expect(totalFunding).to.eq(FUND_AMOUNT);
      });

      it("should emit LogFunding event", async () => {
        await expect(_donors[1].sendTransaction({ to: _contract.address, value: FUND_AMOUNT }))
        .to.emit(_contract, 'LogFunding')
        .withArgs(await _donors[1].getAddress(), FUND_AMOUNT );
      });

      it("should handle donation of 1 wei", async () => {
        // Pre balances.
        const [
          preGranteeBalance0,
          preGranteeBalance1,
          preGranteeBalance2,
          preGranteeBalance3
        ] = await getEtherBalances(_provider, _grantees);

        await _donors[1].sendTransaction({ to: _contract.address, value: 1 });

        // Post balances.
        const [
          postGranteeBalance0,
          postGranteeBalance1,
          postGranteeBalance2,
          postGranteeBalance3
        ] = await getEtherBalances(_provider, _grantees);

        // Delta original balances to new balances.
        const granteeBalanceDelta0 = postGranteeBalance0.sub(preGranteeBalance0);
        const granteeBalanceDelta1 = postGranteeBalance1.sub(preGranteeBalance1);
        const granteeBalanceDelta2 = postGranteeBalance2.sub(preGranteeBalance2);
        const granteeBalanceDelta3 = postGranteeBalance3.sub(preGranteeBalance3);

        // NOTE: Rounding causes 1 wei to go to final grantee.
        expect(granteeBalanceDelta0).to.be.equal(0);
        expect(granteeBalanceDelta1).to.be.equal(0);
        expect(granteeBalanceDelta2).to.be.equal(0);
        expect(granteeBalanceDelta3).to.be.equal(1);
      });

      it("should handle donation of 4 wei", async () => {
        // Pre balances.
        const [
          preGranteeBalance0,
          preGranteeBalance1,
          preGranteeBalance2,
          preGranteeBalance3
        ] = await getEtherBalances(_provider, _grantees);

        await _donors[1].sendTransaction({ to: _contract.address, value: 4 });

        // Post balances.
        const [
          postGranteeBalance0,
          postGranteeBalance1,
          postGranteeBalance2,
          postGranteeBalance3
        ] = await getEtherBalances(_provider, _grantees);

        // Delta original balances to new balances.
        const granteeBalanceDelta0 = postGranteeBalance0.sub(preGranteeBalance0);
        const granteeBalanceDelta1 = postGranteeBalance1.sub(preGranteeBalance1);
        const granteeBalanceDelta2 = postGranteeBalance2.sub(preGranteeBalance2);
        const granteeBalanceDelta3 = postGranteeBalance3.sub(preGranteeBalance3);

        // NOTE: Rounding wei to go to grantee with largest allocation and final grantee.
        //
        // > const AMOUNTS = [150, 456, 111, 23];
        // undefined
        // > const SUM_OF_AMOUNTS = AMOUNTS.reduce((x, y) => x + y);
        // undefined
        // > const PERCENTAGES = AMOUNTS.map(x => x/SUM_OF_AMOUNTS);
        // undefined
        // > PERCENTAGES.map(x => Math.floor(x*4))
        // [ 0, 2, 0, 0 ]
        expect(granteeBalanceDelta0).to.be.equal(0);
        expect(granteeBalanceDelta1).to.be.equal(2);
        expect(granteeBalanceDelta2).to.be.equal(0);
        expect(granteeBalanceDelta3).to.be.equal(2);
      });

      it("should handle donation of SUM_OF_AMOUNTS [ @skip-on-coverage ]", async () => {
        // Pre balances.
        const [
          preGranteeBalance0,
          preGranteeBalance1,
          preGranteeBalance2,
          preGranteeBalance3
        ] = await getEtherBalances(_provider, _grantees);

        await _donors[1].sendTransaction({ to: _contract.address, value: utils.parseEther(SUM_OF_AMOUNTS.toString()) });

        // Post balances.
        const [
          postGranteeBalance0,
          postGranteeBalance1,
          postGranteeBalance2,
          postGranteeBalance3
        ] = await getEtherBalances(_provider, _grantees);

        // Delta original balances to new balances.
        const granteeBalanceDelta0 = postGranteeBalance0.sub(preGranteeBalance0);
        const granteeBalanceDelta1 = postGranteeBalance1.sub(preGranteeBalance1);
        const granteeBalanceDelta2 = postGranteeBalance2.sub(preGranteeBalance2);
        const granteeBalanceDelta3 = postGranteeBalance3.sub(preGranteeBalance3);

        // CAUTION: only approximately true. Small amount of WEI is being rounded.
        // See
        // console.log(granteeBalanceDelta0.toString());
        // console.log(granteeBalanceDelta1.toString());
        // console.log(granteeBalanceDelta2.toString());
        // console.log(granteeBalanceDelta3.toString());
        // VS
        // console.log(parseFloat(utils.formatEther(granteeBalanceDelta0).toString()));
        // console.log(parseFloat(utils.formatEther(granteeBalanceDelta1).toString()));
        // console.log(parseFloat(utils.formatEther(granteeBalanceDelta2).toString()));
        // console.log(parseFloat(utils.formatEther(granteeBalanceDelta3).toString()));
        expect(parseFloat(utils.formatEther(granteeBalanceDelta0).toString())).to.equal(AMOUNTS[0]);
        expect(parseFloat(utils.formatEther(granteeBalanceDelta1).toString())).to.equal(AMOUNTS[1]);
        expect(parseFloat(utils.formatEther(granteeBalanceDelta2).toString())).to.equal(AMOUNTS[2]);
        expect(parseFloat(utils.formatEther(granteeBalanceDelta3).toString())).to.equal(AMOUNTS[3]);
      });

    });

  });


});
