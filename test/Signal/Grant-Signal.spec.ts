import Grant from "../../build/Grant.json";
import GrantToken from "../../build/GrantToken.json";
import GrantFactory from "../../build/GrantFactory.json";
import chai from "chai";
import * as waffle from "ethereum-waffle";
import { Contract, Wallet, constants } from "ethers";
import { BigNumber } from "ethers/utils/bignumber";
import { AddressZero, Zero } from "ethers/constants";

chai.use(waffle.solidity);
const { expect, assert } = chai;

describe("Grant", () => {
  const _amounts = [1000];
  const _targetFunding = _amounts.reduce((a, b) => a + b, 0);

  async function fixture(provider: any, wallets: Wallet[]) {
    const currentTime = (await provider.getBlock(await provider.getBlockNumber())).timestamp;
    const [granteeWallet, donorWallet, managerWallet] = wallets;
    const token: Contract = await waffle.deployContract(donorWallet, GrantToken, ["Grant Token", "GT"]);

    const grantWithToken: Contract = await waffle.deployContract(
      granteeWallet,
      Grant,
      [
        [granteeWallet.address],
        _amounts,
        managerWallet.address,
        token.address,
        _targetFunding,
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
        _amounts,
        managerWallet.address,
        AddressZero,
        _targetFunding,
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

  describe("Signaling", () => {
    const _positiveSupport = true;
    const _negativeSupport = false;

    let _grantFromDonor: Contract;
    const _fundAmount = _targetFunding;

    before(async () => {
      const { grantFromDonor, token } = await waffle.loadFixture(fixture);
      _grantFromDonor = grantFromDonor;

      await token.approve(grantFromDonor.address, 1e3);
      await _grantFromDonor.fund(_fundAmount);
    });

    it("should revert if total funding = target funding", async () => {
      await expect(_grantFromDonor.signal(_positiveSupport, 1e3)).to.be.revertedWith(
        "signal::Status Error. Funding target reached."
      );
    });

    describe("With Ether", () => {
      let _grantFromDonorWithEther: Contract;
      let _provider: any;
      let _donorWallet: Wallet;

      before(async () => {
        const { grantFromDonorWithEther, donorWallet, provider } = await waffle.loadFixture(fixture);
        _grantFromDonorWithEther = grantFromDonorWithEther;
        _provider = provider;
        _donorWallet = donorWallet;
      });

      it("should fail if ether sent does not match value arg", async () => {
        await expect(_grantFromDonorWithEther.signal(_positiveSupport, 1e6)).to.be.revertedWith(
          "signal::Invalid Argument. value must match msg.value."
        );
      });

      it("should emit LogSignal event", async () => {
        await expect(_grantFromDonorWithEther.signal(_positiveSupport, 1e6, { value: 1e6 }))
          .to.emit(_grantFromDonorWithEther, "LogSignal")
          .withArgs(_positiveSupport, _donorWallet.address, constants.AddressZero, 1e6);
      });

      it("should returned funds to donor", async () => {
        const balanceBeforeSignal = await _provider.getBalance(_donorWallet.address);

        // Set gas price to 1 to make it simple to calc gas spent in eth.
        const receipt = await (
          await _grantFromDonorWithEther.signal(_positiveSupport, 1e6, {
            value: 1e6,
            gasPrice: 1
          })
        ).wait();

        const balanceAfterSignal = await _provider.getBalance(_donorWallet.address);

        expect(balanceBeforeSignal.sub(receipt.gasUsed)).to.eq(balanceAfterSignal);
      });
    });

    describe("With Token", () => {
      describe("With positive value", () => {
        let _grantFromDonor: Contract;
        let _donorWallet: Wallet;
        let _token: Contract;

        before(async () => {
          const { grantFromDonor, token, donorWallet } = await waffle.loadFixture(fixture);
          _grantFromDonor = grantFromDonor;
          _token = token;
          _donorWallet = donorWallet;
          await token.mint(_donorWallet.address, 1e6);
        });

        it("should fail if no tokens approved", async () => {
          await expect(_grantFromDonor.signal(_positiveSupport, 1)).to.be.revertedWith(
            "SafeMath: subtraction overflow"
          );
        });

        describe("When approved", async () => {
          const signalValue = 10;
          before(async () => {
            await _token.approve(_grantFromDonor.address, 1e6);
          });

          it("should reject ether signalling for token funded grants", async () => {
            await expect(
              _grantFromDonor.signal(_positiveSupport, signalValue, { value: signalValue })
            ).to.be.revertedWith("signal::Currency Error. Cannot send Ether to a token funded grant.");
          });

          it("should emit LogSignal event", async () => {
            await expect(_grantFromDonor.signal(_positiveSupport, signalValue))
              .to.emit(_grantFromDonor, "LogSignal")
              .withArgs(_positiveSupport, _donorWallet.address, _token.address, signalValue);
          });

          it("sender should have their funds returned", async () => {
            const balanceBeforeSignal = await _token.balanceOf(_donorWallet.address);
            await _grantFromDonor.signal(_positiveSupport, signalValue);
            const balanceAfterSignal = await _token.balanceOf(_donorWallet.address);
            expect(balanceBeforeSignal).to.eq(balanceAfterSignal);
          });
        });
      });

      describe("Without positive value", () => {
        let _grantFromDonor: Contract;

        before(async () => {
          const { grantFromDonor, token, donorWallet } = await waffle.loadFixture(fixture);
          _grantFromDonor = grantFromDonor;

          // Initial token balance.
          await token.mint(donorWallet.address, 1e6);
          await token.approve(_grantFromDonor.address, 1e6);
        });

        it("should reject if value is zero", async () => {
          await expect(_grantFromDonor.signal(_positiveSupport, Zero)).to.be.reverted;
        });
      });
    });
  });

});
