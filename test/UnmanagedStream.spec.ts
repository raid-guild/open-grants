import chai from "chai";
import chaiAlmost from "chai-almost";
import * as waffle from "ethereum-waffle";
import { Contract, Signer, utils } from "ethers";
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
    donorWallet0,
    donorWallet1,
    granteeWallet0,
    granteeWallet1,
    granteeWallet2,
    granteeWallet3,
    provider,
    unmanagedStream
  };
}

describe("Unmanaged-Stream", () => {

  describe("With Ether", () => {
    let _donorWallet0: Signer;
    let _donorWallet1: Signer;
    let _granteeWallet0: Signer;
    let _granteeWallet1: Signer;
    let _granteeWallet3: Signer;
    let _granteeWallet2: Signer;
    let _provider: any;
    let _unmanagedStream: Contract;

    before(async () => {

      const {
        donorWallet0,
        donorWallet1,
        granteeWallet0,
        granteeWallet1,
        granteeWallet2,
        granteeWallet3,
        provider,
        unmanagedStream
      } = await fixture(bre);

      _donorWallet0 = donorWallet0;
      _donorWallet1 = donorWallet1;
      _granteeWallet0 = granteeWallet0;
      _granteeWallet1 = granteeWallet1;
      _granteeWallet2 = granteeWallet2;
      _granteeWallet3 = granteeWallet3;
      _provider = provider;
      _unmanagedStream = unmanagedStream;

    });

    it("should record correct grantee amounts", async () => {
      const grantee0Amount = await _unmanagedStream.getGranteeTargetFunding(await _granteeWallet0.getAddress());
      const grantee1Amount = await _unmanagedStream.getGranteeTargetFunding(await _granteeWallet1.getAddress());
      const grantee2Amount = await _unmanagedStream.getGranteeTargetFunding(await _granteeWallet2.getAddress());
      const grantee3Amount = await _unmanagedStream.getGranteeTargetFunding(await _granteeWallet3.getAddress());

      expect(grantee0Amount).to.eq(AMOUNTS[0]);
      expect(grantee1Amount).to.eq(AMOUNTS[1]);
      expect(grantee2Amount).to.eq(AMOUNTS[2]);
      expect(grantee3Amount).to.eq(AMOUNTS[3]);

    });

    it("should record correct CumulativeTargetFunding", async () => {
      const cumulativeTargetFunding = await _unmanagedStream.getCumulativeTargetFunding();
      expect(cumulativeTargetFunding).to.eq(SUM_OF_AMOUNTS);
    });

    it("should record correct currency", async () => {
      const currency = await _unmanagedStream.getCurrency();
      expect(currency).to.eq(AddressZero);
    });

    it("should record correct URI", async () => {
      const uri = await _unmanagedStream.getUri();
      expect(utils.toUtf8String(uri)).to.eq(URI);
    });

    describe("sending funds", () => {
      let _granteeBalance0: BigNumber;
      let _granteeBalance1: BigNumber;
      let _granteeBalance2: BigNumber;
      let _granteeBalance3: BigNumber;

      before(async () => {
        _granteeBalance0 = await _provider.getBalance(await _granteeWallet0.getAddress());
        _granteeBalance1 = await _provider.getBalance(await _granteeWallet1.getAddress());
        _granteeBalance2 = await _provider.getBalance(await _granteeWallet2.getAddress());
        _granteeBalance3 = await _provider.getBalance(await _granteeWallet3.getAddress());

        await _donorWallet0.sendTransaction({ to: _unmanagedStream.address, value: FUND_AMOUNT });
      });

      it("should split funds correctly", async () => {

        // New balances.
        const newGranteeBalance0 = await _provider.getBalance(await _granteeWallet0.getAddress());
        const newGranteeBalance1 = await _provider.getBalance(await _granteeWallet1.getAddress());
        const newGranteeBalance2 = await _provider.getBalance(await _granteeWallet2.getAddress());
        const newGranteeBalance3 = await _provider.getBalance(await _granteeWallet3.getAddress());

        // Delta original balances to new balances.
        const granteeBalanceDelta0 = newGranteeBalance0.sub(_granteeBalance0);
        const granteeBalanceDelta1 = newGranteeBalance1.sub(_granteeBalance1);
        const granteeBalanceDelta2 = newGranteeBalance2.sub(_granteeBalance2);
        const granteeBalanceDelta3 = newGranteeBalance3.sub(_granteeBalance3);

        // Expected share of fund amount.
        const granteeExpectedBalance0 = ((AMOUNTS[0] / SUM_OF_AMOUNTS) * parseInt(utils.formatEther(FUND_AMOUNT)));
        const granteeExpectedBalance1 = ((AMOUNTS[1] / SUM_OF_AMOUNTS) * parseInt(utils.formatEther(FUND_AMOUNT)));
        const granteeExpectedBalance2 = ((AMOUNTS[2] / SUM_OF_AMOUNTS) * parseInt(utils.formatEther(FUND_AMOUNT)));
        const granteeExpectedBalance3 = ((AMOUNTS[3] / SUM_OF_AMOUNTS) * parseInt(utils.formatEther(FUND_AMOUNT)));

        // Contract Balance should be 0
        expect((await _provider.getBalance(await _unmanagedStream.address)).toNumber()).to.be.equal(0);

        // CAUTION: Testing to 16 decimal places only (using almost.equal).
        expect(parseFloat(utils.formatEther(granteeBalanceDelta0))).to.almost.equal(granteeExpectedBalance0);
        expect(parseFloat(utils.formatEther(granteeBalanceDelta1))).to.almost.equal(granteeExpectedBalance1);
        expect(parseFloat(utils.formatEther(granteeBalanceDelta2))).to.almost.equal(granteeExpectedBalance2);
        expect(parseFloat(utils.formatEther(granteeBalanceDelta3))).to.almost.equal(granteeExpectedBalance3);

      });

      it("should update totalFunding global", async () => {
        const totalFunding = await _unmanagedStream.getTotalFunding();
        expect(totalFunding).to.eq(FUND_AMOUNT);
      });

      it("should emit LogFunding event", async () => {
        await expect(_donorWallet1.sendTransaction({ to: _unmanagedStream.address, value: FUND_AMOUNT }))
        .to.emit(_unmanagedStream, 'LogFunding')
        .withArgs(await _donorWallet1.getAddress(), FUND_AMOUNT );
      });

      it("should handle donation of 1 wei", async () => {
        // Pre balances.
        const preGranteeBalance0 = await _provider.getBalance(await _granteeWallet0.getAddress());
        const preGranteeBalance1 = await _provider.getBalance(await _granteeWallet1.getAddress());
        const preGranteeBalance2 = await _provider.getBalance(await _granteeWallet2.getAddress());
        const preGranteeBalance3 = await _provider.getBalance(await _granteeWallet3.getAddress());

        await _donorWallet1.sendTransaction({ to: _unmanagedStream.address, value: 1 });

        // Post balances.
        const postGranteeBalance0 = await _provider.getBalance(await _granteeWallet0.getAddress());
        const postGranteeBalance1 = await _provider.getBalance(await _granteeWallet1.getAddress());
        const postGranteeBalance2 = await _provider.getBalance(await _granteeWallet2.getAddress());
        const postGranteeBalance3 = await _provider.getBalance(await _granteeWallet3.getAddress());

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
        const preGranteeBalance0 = await _provider.getBalance(await _granteeWallet0.getAddress());
        const preGranteeBalance1 = await _provider.getBalance(await _granteeWallet1.getAddress());
        const preGranteeBalance2 = await _provider.getBalance(await _granteeWallet2.getAddress());
        const preGranteeBalance3 = await _provider.getBalance(await _granteeWallet3.getAddress());

        await _donorWallet1.sendTransaction({ to: _unmanagedStream.address, value: 4 });

        // Post balances.
        const postGranteeBalance0 = await _provider.getBalance(await _granteeWallet0.getAddress());
        const postGranteeBalance1 = await _provider.getBalance(await _granteeWallet1.getAddress());
        const postGranteeBalance2 = await _provider.getBalance(await _granteeWallet2.getAddress());
        const postGranteeBalance3 = await _provider.getBalance(await _granteeWallet3.getAddress());

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

    });

  });


});
