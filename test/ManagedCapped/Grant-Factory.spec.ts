import Grant from "../../build/MangedCappedGrant.json";
import GrantToken from "../../build/GrantToken.json";
import GrantFactory from "../../build/GrantFactory.json";
import chai from "chai";
import * as waffle from "ethereum-waffle";
import { Contract, Wallet, constants } from "ethers";
import { BigNumber } from "ethers/utils/bignumber";
import { Web3Provider, Provider } from "ethers/providers";
import { bigNumberify, randomBytes, solidityKeccak256, id } from "ethers/utils";
import { AddressZero, Zero } from "ethers/constants";
import { helpers } from "../helpers/helpers";

const fixture = helpers.fixtures.fixture;
const TARGET_FUNDING = helpers.constants.TARGET_FUNDING;
const AMOUNTS = helpers.constants.AMOUNTS;

chai.use(waffle.solidity);
const { expect, assert } = chai;

describe("Grant", () => {

  describe("Create Grant", () => {
    let _granteeWallet: Wallet;
    let _managerWallet: Wallet;
    let _donorWallet: Wallet;
    let _secondDonorWallet: Wallet;
    let _unknownWallet: Wallet;
    let _granteeFactory: Contract;
    let _fundingDeadline: BigNumber;
    let _contractExpiration: BigNumber;
    let _token: Contract;
    let _provider: Provider;

    let currentTime: any;

    before(async () => {
      const {
        tokenFromDonor,
        granteeWallet,
        donorWallet,
        managerWallet,
        secondDonorWallet,
        unknownWallet,
        fundingDeadline,
        contractExpiration,
        provider,
        grantFactory,

      } = await waffle.loadFixture(fixture);

      _granteeWallet = granteeWallet;
      _managerWallet = managerWallet;
      _donorWallet = donorWallet;
      _unknownWallet = unknownWallet;
      _secondDonorWallet = secondDonorWallet;
      _granteeFactory = grantFactory;
      _fundingDeadline = fundingDeadline;
      _contractExpiration = contractExpiration;
      _token = tokenFromDonor;
      _provider = provider;

      currentTime = (await _provider.getBlock(await _provider.getBlockNumber())).timestamp;
    });

    it("should fail if fundingDeadline greater than contractExpiration", async () => {
      await expect(
        _granteeFactory.create(
          [_granteeWallet.address],
          [1000],
          _managerWallet.address,
          AddressZero,
          1000,
          currentTime + 86400 * 2,
          currentTime + 86400,
          "0x0",
          { gasLimit: 6e6 }
        )
      ).to.be.revertedWith("constructor::Invalid Argument. _fundingDeadline not < _contractExpiration.");
    });

    it("should fail if fundingDeadline less than now", async () => {
      await expect(
        _granteeFactory.create(
          [_granteeWallet.address],
          [1000],
          _managerWallet.address,
          AddressZero,
          1000,
          currentTime - 1,
          currentTime + 86400,
          "0x0",
          { gasLimit: 6e6 }
        )
      ).revertedWith("constructor::Invalid Argument. _fundingDeadline not > now");
    });

    it("should fail if contractExpiration less than now", async () => {
      await expect(
        _granteeFactory.create([_granteeWallet.address], [1000], _managerWallet.address, AddressZero, 1000, 0, 1, "0x0", {
          gasLimit: 6e6
        })
      ).to.be.revertedWith("constructor::Invalid Argument. _contractExpiration not > now.");
    });

    it("should fail if there is no grantees ", async () => {
      await expect(
        _granteeFactory.create(
          [],
          [1000],
          _managerWallet.address,
          AddressZero,
          1000,
          currentTime + 86400,
          currentTime + 86400 * 2,
          "0x0",
          { gasLimit: 6e6 }
        )
      ).to.be.revertedWith("constructor::Invalid Argument. Must have one or more grantees.");
    });

    it("should fail if number of grantees and amounts are unequal", async () => {
      await expect(
        _granteeFactory.create(
          [_granteeWallet.address],
          [],
          _managerWallet.address,
          AddressZero,
          1000,
          currentTime + 86400,
          currentTime + 86400 * 2,
          "0x0",
          { gasLimit: 6e6 }
        )
      ).to.be.revertedWith("constructor::Invalid Argument. _grantees.length must equal _amounts.length");
    });

    it("should fail if one amount in amount array is not > 0", async () => {
      await expect(
        _granteeFactory.create(
          [_granteeWallet.address],
          [0],
          _managerWallet.address,
          AddressZero,
          1000,
          currentTime + 86400,
          currentTime + 86400 * 2,
          "0x0",
          { gasLimit: 6e6 }
        )
      ).to.be.revertedWith("constructor::Invalid Argument. currentAmount must be greater than 0.");
    });

    it("should fail if duplicate grantee exists", async () => {
      await expect(
        _granteeFactory.create(
          [_granteeWallet.address, _unknownWallet.address, _granteeWallet.address],
          [1000, 1000, 1000],
          _managerWallet.address,
          AddressZero,
          3000,
          currentTime + 86400,
          currentTime + 86400 * 2,
          "0x0",
          { gasLimit: 6e6 }
        )
      ).to.be.revertedWith("constructor::Invalid Argument. Duplicate or out of order _grantees.");
    });

    it("should fail if manager is included in list of grantee", async () => {
      await expect(
        _granteeFactory.create(
          [_granteeWallet.address],
          [1000],
          _granteeWallet.address,
          AddressZero,
          1000,
          currentTime + 86400,
          currentTime + 86400 * 2,
          "0x0",
          { gasLimit: 6e6 }
        )
      ).to.be.revertedWith("constructor::Invalid Argument. _manager cannot be a Grantee.");
    });

    it("should fail if targetFunding != totalFundingAmount", async () => {

      await expect(
        _granteeFactory.create(
          [_granteeWallet.address, _unknownWallet.address],
          [1000, 1000],
          _managerWallet.address,
          AddressZero,
          3000,
          currentTime + 86400,
          currentTime + 86400 * 2,
          "0x0",
          { gasLimit: 6e6 }
        )
      ).to.be.revertedWith("constructor::Invalid Argument. _targetFunding != totalGranteeAllocation.");
    });

    describe("Grant Properties", () => {
      let _grant: Contract;
      let _receipt: any;
      before(async ()=> {
        _receipt = await (await _granteeFactory.create(
          [_granteeWallet.address],
          AMOUNTS,
          _managerWallet.address,
          _token.address,
          TARGET_FUNDING,
          _fundingDeadline,
          _contractExpiration,
          "0x0",
          { gasLimit: 6e6 }
        )).wait();
        const log = _granteeFactory.interface.parseLog(_receipt.logs[0] as unknown as { topics: string[]; data: string; });
        const grantAddress = log.values.grant;
        
        _grant = new Contract(grantAddress, Grant.abi, _donorWallet);

      });

      it("should persist the correct overall funding target", async () => {
        const targetFunding = await _grant.targetFunding();
        expect(targetFunding).to.be.eq(TARGET_FUNDING);
      });
  
      it("should persist the correct funding target of a grantee", async () => {
        const { targetFunding } = await _grant.grantees(_granteeWallet.address);
        expect(targetFunding).to.be.eq(TARGET_FUNDING);
      });
  
      it("should persist the initial total funding as zero", async () => {
        const totalFunding = await _grant.totalFunding();
        expect(totalFunding).to.be.eq(Zero);
      });
  
      it("should persist the correct manager", async () => {
        const managerAddress = await _grant.manager();
        expect(managerAddress).to.be.eq(_managerWallet.address);
      });
  
      it("should persist the correct currency", async () => {
        const currency = await _grant.currency();
        expect(currency).to.be.eq(_token.address);
      });
  
      it("should persist the correct fundingDeadline", async () => {
        const fundingDeadline = await _grant.fundingDeadline();
        expect(fundingDeadline).to.be.eq(_fundingDeadline);
      });
  
      it("should persist the correct contractExpiration", async () => {
        const contractExpiration = await _grant.contractExpiration();
        expect(contractExpiration).to.be.eq(_contractExpiration);
      });
  
      it("should persist the status as not cancelled", async () => {
        const cancelled = await _grant.grantCancelled();
        expect(cancelled).to.be.eq(false);
      });
    });
  });
});
