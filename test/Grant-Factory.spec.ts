import Grant from "../build/Grant.json";
import GrantToken from "../build/GrantToken.json";
import GrantFactory from "../build/GrantFactory.json";
import chai from "chai";
import * as waffle from "ethereum-waffle";
import { Contract, Wallet, constants } from "ethers";
import { BigNumber } from "ethers/utils/bignumber";
import { Web3Provider, Provider } from "ethers/providers";
import { bigNumberify, randomBytes, solidityKeccak256, id } from "ethers/utils";
import { AddressZero, Zero } from "ethers/constants";

chai.use(waffle.solidity);
const { expect, assert } = chai;

describe("Grant", () => {
  const AMOUNTS = [1000];
  const TARGET_FUNDING = AMOUNTS.reduce((a, b) => a + b, 0);

  async function fixture(provider: any, wallets: Wallet[]) {
    const currentTime = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
    const [granteeWallet, donorWallet, managerWallet] = wallets;
    const token: Contract = await waffle.deployContract(donorWallet, GrantToken, ["Grant Token", "GT"]);

    const grantWithToken: Contract = await waffle.deployContract(
      granteeWallet,
      Grant,
      [
        [granteeWallet.address],
        AMOUNTS,
        managerWallet.address,
        token.address,
        TARGET_FUNDING,
        currentTime + 86400,
        currentTime + 86400 * 2
      ],
      { gasLimit: 6e6 }
    );

    const grantWithEther: Contract = await waffle.deployContract(
      granteeWallet,
      Grant,
      [
        [granteeWallet.address],
        AMOUNTS,
        managerWallet.address,
        AddressZero,
        TARGET_FUNDING,
        currentTime + 86400,
        currentTime + 86400 * 2
      ],
      { gasLimit: 6e6 }
    );

    const grantFactory: Contract = await waffle.deployContract(donorWallet, GrantFactory, undefined, { gasLimit: 6e6 });

    // Initial token balance.
    await token.mint(donorWallet.address, 1e6);

    const grantFromDonor: Contract = new Contract(grantWithToken.address, Grant.abi, donorWallet);
    const grantFromDonorWithEther: Contract = new Contract(grantWithEther.address, Grant.abi, donorWallet);
    const grantFromManager: Contract = new Contract(grantWithToken.address, Grant.abi, managerWallet);
    const grantFromManagerWithEther: Contract = new Contract(grantWithEther.address, Grant.abi, managerWallet);

    return {
      grantFactory,
      grantWithToken,
      grantWithEther,
      grantFromDonor,
      grantFromDonorWithEther,
      grantFromManager,
      grantFromManagerWithEther,
      grantFromGrantee: grantWithToken,
      token,
      granteeWallet,
      donorWallet,
      managerWallet,
      fundingDeadline: currentTime + 86400,
      contractExpiration: currentTime + 86400 * 2,
      provider,
      wallets
    };
  }

  describe("Create Grant", () => {
    let _granteeAddress: string;
    let _granteeFactory: Contract;
    let _managerAddress: string;
    let _fundingDeadline: BigNumber;
    let _contractExpiration: BigNumber;
    let _grant: Contract;
    let _token: Contract;
    let _provider: Provider;
    let _wallets: Wallet[];

    let currentTime: any;

    before(async () => {
      const {
        grantWithToken,
        token,
        granteeWallet,
        managerWallet,
        fundingDeadline,
        contractExpiration,
        provider,
        grantFactory,
        wallets
      } = await waffle.loadFixture(fixture);

      _granteeAddress = granteeWallet.address;
      _granteeFactory = grantFactory;
      _managerAddress = managerWallet.address;
      _fundingDeadline = fundingDeadline;
      _contractExpiration = contractExpiration;
      _grant = grantWithToken;
      _token = token;
      _provider = provider;
      _wallets = wallets;

      currentTime = (await _provider.getBlock(await _provider.getBlockNumber())).timestamp;
    });

    it("should fail if fundingDeadline greater than contractExpiration", async () => {
      await expect(
        _granteeFactory.create(
          [_granteeAddress],
          [1000],
          _managerAddress,
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
          [_granteeAddress],
          [1000],
          _managerAddress,
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
        _granteeFactory.create([_granteeAddress], [1000], _managerAddress, AddressZero, 1000, 0, 1, "0x0", {
          gasLimit: 6e6
        })
      ).to.be.revertedWith("constructor::Invalid Argument. _contractExpiration not > now.");
    });

    it("should fail if there is no grantees ", async () => {
      await expect(
        _granteeFactory.create(
          [],
          [1000],
          _managerAddress,
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
          [_granteeAddress],
          [],
          _managerAddress,
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
          [_granteeAddress],
          [0],
          _managerAddress,
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
      const _newGranteeAddress: string = _wallets[3].address;
      await expect(
        _granteeFactory.create(
          [_granteeAddress, _newGranteeAddress, _granteeAddress],
          [1000, 1000, 1000],
          _managerAddress,
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
          [_granteeAddress],
          [1000],
          _granteeAddress,
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
      const _newGranteeAddress: string = _wallets[3].address;
      await expect(
        _granteeFactory.create(
          [_granteeAddress, _newGranteeAddress],
          [1000, 1000],
          _managerAddress,
          AddressZero,
          3000,
          currentTime + 86400,
          currentTime + 86400 * 2,
          "0x0",
          { gasLimit: 6e6 }
        )
      ).to.be.revertedWith("constructor::Invalid Argument. _targetFunding must equal totalFundingAmount.");
    });

    it("should persist the correct overall funding target", async () => {
      const targetFunding = await _grant.targetFunding();
      expect(targetFunding).to.be.eq(TARGET_FUNDING);
    });

    it("should persist the correct funding target of a grantee", async () => {
      const { targetFunding } = await _grant.grantees(_granteeAddress);
      expect(targetFunding).to.be.eq(TARGET_FUNDING);
    });

    it("should persist the initial total funding as zero", async () => {
      const totalFunding = await _grant.totalFunding();
      expect(totalFunding).to.be.eq(Zero);
    });

    it("should persist the correct manager", async () => {
      const managerAddress = await _grant.manager();
      expect(managerAddress).to.be.eq(_managerAddress);
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
