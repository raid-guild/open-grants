import Grant from "../../build/MangedCappedGrant.json";
import GrantToken from "../../build/GrantToken.json";
import GrantFactory from "../../build/GrantFactory.json";
import chai from "chai";
import * as waffle from "ethereum-waffle";
import { Contract, Wallet, constants } from "ethers";
import { BigNumber } from "ethers/utils/bignumber";
import { AddressZero, Zero } from "ethers/constants";
import { helpers } from "../helpers/helpers";

const fixture = helpers.fixtures.fixture;


chai.use(waffle.solidity);
const { expect, assert } = chai;

describe("Grant-Cancel", () => {

  describe("Cancelling Grant", () => {
    describe("With Ether", () => {
      let _donorWallet: Wallet;
      let _granteeWallet: Wallet;

      let _grantFromManagerWithEther: Contract;
      let _grantFromDonorWithEther: Contract;

      before(async () => {
        const {
          donorWallet,
          granteeWallet,
          grantFromManagerWithEther,
          grantFromDonorWithEther
        } = await waffle.loadFixture(fixture);
        _donorWallet = donorWallet;
        _grantFromDonorWithEther = grantFromDonorWithEther;
        _grantFromManagerWithEther = grantFromManagerWithEther;
        _granteeWallet = granteeWallet;
      });

      it("should fail if not GrantManager", async () => {
        await expect(_grantFromDonorWithEther.cancelGrant()).to.be.revertedWith(
          "cancelGrant::Invalid Sender. Sender must be manager or expired."
        );
      });

      it("should cancel grant with emiting LogGrantCancellation event", async () => {
        await expect(_grantFromManagerWithEther.cancelGrant())
          .to.emit(_grantFromManagerWithEther, "LogGrantCancellation")
          .withArgs();
        expect(await _grantFromManagerWithEther.grantCancelled()).to.be.true;
      });

      it("should revert if cancelled already", async () => {
        await expect(_grantFromManagerWithEther.cancelGrant()).to.be.revertedWith(
          "cancelGrant::Status Error. Already cancelled."
        );
      });

      it("should revert if donor tries to fund when grant is cancelled", async () => {
        await expect(
          _donorWallet.sendTransaction({
            to: _grantFromDonorWithEther.address,
            value: 1e6
          })
        ).to.be.revertedWith("fund::Status Error. Grant not open to funding.");
      });

      describe("Grant funded by donor", () => {
        let _grantFromManagerWithEther: Contract;
        let _grantFromDonorWithEther: Contract;

        before(async () => {
          const { granteeWallet, grantFromManagerWithEther, grantFromDonorWithEther } = await waffle.loadFixture(
            fixture
          );
          _grantFromDonorWithEther = grantFromDonorWithEther;
          _grantFromManagerWithEther = grantFromManagerWithEther;
          _granteeWallet = granteeWallet;

          // funded by donor
          await _donorWallet.sendTransaction({
            to: _grantFromDonorWithEther.address,
            value: 1e6
          });

          // Cancel Grant
          await _grantFromManagerWithEther.cancelGrant();
        });

        it("Approve payout should revert if cancelled already", async () => {
          await expect(_grantFromManagerWithEther.approvePayout(1e3, _granteeWallet.address)).to.be.revertedWith(
            "approvePayout::Status Error. Cannot approve if grant is cancelled."
          );
        });
      });
    });

    describe("With Token", () => {
      let _granteeWallet: Wallet;
      let _grantFromManagerWithToken: Contract;
      let _grantFromDonorWithToken: Contract;
      const _fundAmount = 500;

      before(async () => {
        const { tokenFromDonor, granteeWallet, grantFromManagerWithToken, grantFromDonorWithToken } = await waffle.loadFixture(fixture);
        _grantFromDonorWithToken = grantFromDonorWithToken;
        _grantFromManagerWithToken = grantFromManagerWithToken;
        _granteeWallet = granteeWallet;

        await tokenFromDonor.approve(grantFromDonorWithToken.address, 1000);
      });

      it("should permit anyone to cancel if past funding deadline");
      it("should permit anyone to cancel if past contract expiration");

      it("should fail if not GrantManager", async () => {
        await expect(_grantFromDonorWithToken.cancelGrant()).to.be.revertedWith(
          "cancelGrant::Invalid Sender. Sender must be manager or expired."
        );
      });

      it("should cancel grant with emiting LogGrantCancellation event", async () => {
        await expect(_grantFromManagerWithToken.cancelGrant())
          .to.emit(_grantFromManagerWithToken, "LogGrantCancellation")
          .withArgs();
        expect(await _grantFromManagerWithToken.grantCancelled()).to.be.true;
      });

      it("should revert if cancelled already", async () => {
        await expect(_grantFromManagerWithToken.cancelGrant()).to.be.revertedWith(
          "cancelGrant::Status Error. Already cancelled."
        );
      });

      it("should revert if donor tries to fund when grant is cancelled", async () => {
        await expect(_grantFromDonorWithToken.fund(_fundAmount)).to.be.revertedWith(
          "fund::Status Error. Grant not open to funding."
        );
      });

      describe("Grant funded by donor", () => {
        let _grantFromManagerWithToken: Contract;
        let _grantFromDonorWithToken: Contract;
        const _fundAmount = 1000;

        before(async () => {
          const { tokenFromDonor, granteeWallet, grantFromManagerWithToken, grantFromDonorWithToken } = await waffle.loadFixture(fixture);
          _grantFromDonorWithToken = grantFromDonorWithToken;
          _grantFromManagerWithToken = grantFromManagerWithToken;
          _granteeWallet = granteeWallet;

          await tokenFromDonor.approve(grantFromDonorWithToken.address, 1e6);
          // funded by donor
          await _grantFromDonorWithToken.fund(_fundAmount);
          // Cancel Grant
          await _grantFromManagerWithToken.cancelGrant();
        });

        it("Approve payout should revert if cancelled already", async () => {
          await expect(_grantFromManagerWithToken.approvePayout(_fundAmount, _granteeWallet.address)).to.be.revertedWith(
            "approvePayout::Status Error. Cannot approve if grant is cancelled."
          );
        });
      });
    });
  });
});
