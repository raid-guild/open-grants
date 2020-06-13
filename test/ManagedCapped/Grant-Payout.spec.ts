import Grant from "../../build/MangedCappedGrant.json";
import GrantToken from "../../build/GrantToken.json";
import GrantFactory from "../../build/GrantFactory.json";
import chai from "chai";
import * as waffle from "ethereum-waffle";
import { Contract, Wallet, constants } from "ethers";
import { BigNumber } from "ethers/utils/bignumber";
import { Web3Provider, Provider } from "ethers/providers";
import { bigNumberify, randomBytes, solidityKeccak256, id } from "ethers/utils";
import { AddressZero } from "ethers/constants";
import { helpers } from "../helpers/helpers";

const fixture = helpers.fixtures.fixture;
const TARGET_FUNDING = helpers.constants.TARGET_FUNDING;

chai.use(waffle.solidity);
const { expect, assert } = chai;

describe("Grant", () => {

  describe("With Token", () => {
    describe("Approve Payout", () => {
      let _grantFromDonorWithToken: Contract;
      const _fundAmount = 500;
      const _payoutAmount = _fundAmount;
      let _grantFromManagerWithToken: Contract;
      let _granteeWallet: Wallet;
      let _unknownWallet: Wallet;

      before(async () => {
        const {
          tokenFromDonor,
          grantFromDonorWithToken,
          grantFromManagerWithToken,
          granteeWallet,
          unknownWallet
        } = await waffle.loadFixture(fixture);

        _grantFromDonorWithToken = grantFromDonorWithToken;
        _grantFromManagerWithToken = grantFromManagerWithToken;
        _granteeWallet = granteeWallet;
        _unknownWallet = unknownWallet;

        await tokenFromDonor.approve(grantFromDonorWithToken.address, 1000);
        await (await _grantFromDonorWithToken.fund(_fundAmount)).wait();
      });

      it("should revert if someone other than manager tries to approve payout", async () => {
        await expect(_grantFromDonorWithToken.approvePayout(_fundAmount, _granteeWallet.address)).to.be.revertedWith(
          "onlyManager::Permission Error. Function can only be called by manager."
        );
      });

      it("should revert if target funding != total funding", async () => {
        await expect(_grantFromManagerWithToken.approvePayout(_fundAmount, _granteeWallet.address)).to.be.revertedWith(
          "approvePayout::Status Error. Cannot approve if funding target not met."
        );
      });

      it("should the target funding  == total funding", async () => {
        const targetFunding = await _grantFromDonorWithToken.targetFunding();
        let totalFunding = await _grantFromDonorWithToken.totalFunding();
        await _grantFromDonorWithToken.fund(targetFunding - totalFunding);

        totalFunding = await _grantFromDonorWithToken.totalFunding();
        expect(targetFunding).to.be.eq(totalFunding);
      });

      it("should revert if value > target funding", async () => {
        const { targetFunding } = await _grantFromManagerWithToken.grantees(_granteeWallet.address);
        await expect(_grantFromManagerWithToken.approvePayout(targetFunding + 1, _granteeWallet.address)).to.be.revertedWith(
          "approvePayout::Invalid Argument. value cannot exceed remaining allocation."
        );
      });

      it("should revert if address does not belongs to grantee", async () => {
        await expect(_grantFromManagerWithToken.approvePayout(_payoutAmount, _unknownWallet.address)).to.be.revertedWith(
          "approvePayout::Invalid Argument. value cannot exceed remaining allocation."
        );
      });

      it("should emit LogPaymentApproval on approve payment", async () => {
        await expect(_grantFromManagerWithToken.approvePayout(_payoutAmount, _granteeWallet.address))
          .to.emit(_grantFromManagerWithToken, "LogPaymentApproval")
          .withArgs(_granteeWallet.address, _payoutAmount);
      });

      it("should emit LogPayment on payment withdrawl", async () => {
        await expect(_grantFromManagerWithToken.withdrawPayout(_granteeWallet.address))
          .to.emit(_grantFromManagerWithToken, "LogPayment")
          .withArgs(_granteeWallet.address, _payoutAmount);
      });

      it("should update total payed of grantee and Grant", async () => {
        const totalPaidOfGrant = await _grantFromManagerWithToken.totalPaid();

        const { totalPaid } = await _grantFromManagerWithToken.grantees(_granteeWallet.address);

        expect(totalPaidOfGrant).to.be.eq(totalPaid);
        expect(totalPaid).to.be.eq(_payoutAmount);
      });

      // always at last
      it("should revert if grant is already cancelled", async () => {
        await _grantFromManagerWithToken.cancelGrant();
        await expect(_grantFromManagerWithToken.approvePayout(_fundAmount, _granteeWallet.address)).to.be.revertedWith(
          "approvePayout::Status Error. Cannot approve if grant is cancelled."
        );
      });
    });

    describe("Grantee balance", () => {
      let _grantFromDonorWithToken: Contract;
      const _fundAmount = 5e2;
      const _payoutAmount = _fundAmount;
      let _grantFromManagerWithToken: Contract;
      let _granteeWallet: Wallet;
      let _tokenFromDonor: Contract;

      before(async () => {
        const { tokenFromDonor, grantFromDonorWithToken, grantFromManagerWithToken, granteeWallet } = await waffle.loadFixture(fixture);

        _grantFromDonorWithToken = grantFromDonorWithToken;
        _grantFromManagerWithToken = grantFromManagerWithToken;
        _granteeWallet = granteeWallet;
        _tokenFromDonor = tokenFromDonor;

        await tokenFromDonor.approve(grantFromDonorWithToken.address, TARGET_FUNDING);
        await _grantFromDonorWithToken.fund(TARGET_FUNDING);
      });

      it("should not be updated yet", async () => {
        const tokenBalance = await _tokenFromDonor.balanceOf(_granteeWallet.address);
        expect(tokenBalance).to.eq(0);

        const { totalPaid } = await _grantFromManagerWithToken.grantees(_granteeWallet.address);
        expect(0).to.eq(totalPaid);
      });


      it("should updated with token after payout withdrawl", async () => {
        await _grantFromManagerWithToken.approvePayout(_payoutAmount, _granteeWallet.address);
        await _grantFromManagerWithToken.withdrawPayout(_granteeWallet.address);

        const tokenBalance = await _tokenFromDonor.balanceOf(_granteeWallet.address);
        expect(tokenBalance).to.eq(_payoutAmount);

        const { totalPaid } = await _grantFromManagerWithToken.grantees(_granteeWallet.address);
        expect(_payoutAmount).to.eq(totalPaid);
      });
    });
  });

  describe("With Ether", () => {
    describe("Grantee balance", () => {
      let _grantFromDonorWithEther: Contract;
      let _grantFromManagerWithEther: Contract;
      const _fundAmount = 5e2;
      const _payoutAmount = _fundAmount / 2;
      let _donorWallet: Wallet;
      let _granteeWallet: Wallet;
      let _provider: any;
      let _initialEtherBalance: any;

      before(async () => {
        const {
          grantFromDonorWithEther,
          grantFromManagerWithEther,
          donorWallet,
          granteeWallet,
          provider
        } = await waffle.loadFixture(fixture);

        _donorWallet = donorWallet;
        _granteeWallet = granteeWallet;
        _grantFromDonorWithEther = grantFromDonorWithEther;
        _grantFromManagerWithEther = grantFromManagerWithEther;
        _provider = provider;

        // Donor fund Ether
        await _donorWallet.sendTransaction({
          to: _grantFromDonorWithEther.address,
          value: 1e6,
          gasPrice: 1
        });

        _initialEtherBalance = await _provider.getBalance(_granteeWallet.address);
      });

      it("should not be updated yet", async () => {
        const etherBalance = await _provider.getBalance(_granteeWallet.address);
        expect(_initialEtherBalance).eq(etherBalance);

        const { totalPaid } = await _grantFromManagerWithEther.grantees(_granteeWallet.address);
        expect(0).to.eq(totalPaid);
      });

      it("should updated approved amount approve payout", async () => {
        await _grantFromManagerWithEther.approvePayout(_payoutAmount, _granteeWallet.address);

        const { payoutApproved } = await _grantFromManagerWithEther.grantees(_granteeWallet.address);
        expect(_payoutAmount).eq(payoutApproved);

      });

      it("should updated ether after withdrawl", async () => {
        await _grantFromManagerWithEther.withdrawPayout(_granteeWallet.address);

        const { totalPaid } = await _grantFromManagerWithEther.grantees(_granteeWallet.address);
        expect(_payoutAmount).eq(totalPaid);

        const etherBalanceAfterPayout = await _provider.getBalance(_granteeWallet.address);
        expect(_initialEtherBalance.add(_payoutAmount)).eq(etherBalanceAfterPayout);
      });
    });
  });

  describe("When there are multiple payments to multiple grantees", () => {
    const AMOUNTS = [1000, 500];
    const TARGET_FUNDING = AMOUNTS.reduce((a, b) => a + b, 0);

    async function fixtureWithMultipleGrantee(provider: any, wallets: Wallet[]) {
      const currentTime = (await provider.getBlock(await provider.getBlockNumber())).timestamp;

      const [granteeWallet, secondGranteeWallet, donorWallet, managerWallet, thirdPersonWallet] = wallets;

      const token: Contract = await waffle.deployContract(donorWallet, GrantToken, ["Grant Token", "GT"]);

      const grantWithToken: Contract = await waffle.deployContract(
        granteeWallet,
        Grant,
        [
          [granteeWallet.address, secondGranteeWallet.address],
          AMOUNTS,
          managerWallet.address,
          token.address,
          TARGET_FUNDING,
          currentTime + 86400,
          currentTime + 86400 * 2
        ],
        { gasLimit: 6e6 }
      );

      // Initial token balance.
      await token.mint(donorWallet.address, 1e6);

      const grantFromDonor: Contract = new Contract(grantWithToken.address, Grant.abi, donorWallet);

      const grantFromManager: Contract = new Contract(grantWithToken.address, Grant.abi, managerWallet);

      const grantWithEther: Contract = await waffle.deployContract(
        granteeWallet,
        Grant,
        [
          [granteeWallet.address, secondGranteeWallet.address],
          AMOUNTS,
          managerWallet.address,
          AddressZero,
          TARGET_FUNDING,
          currentTime + 86400,
          currentTime + 86400 * 2
        ],
        { gasLimit: 6e6 }
      );

      const grantFromDonorWithEther: Contract = new Contract(grantWithEther.address, Grant.abi, donorWallet);
      const grantFromManagerWithEther: Contract = new Contract(grantWithEther.address, Grant.abi, managerWallet);

      return {
        grantWithToken,
        grantFromDonor,
        grantFromManager,
        token,
        granteeWallet,
        secondGranteeWallet,
        donorWallet,
        managerWallet,
        thirdPersonWallet,
        provider,
        grantWithEther,
        grantFromDonorWithEther,
        grantFromManagerWithEther
      };
    }

    describe("With Token", () => {
      describe("Grantees' balance", () => {
        let _grantFromDonor: Contract;
        let _grantFromManager: Contract;
        let _granteeWallet: Wallet;
        let _secondGranteeWallet: Wallet;
        let _lasttotalPaidForGrantee: BigNumber;
        let _lasttotalPaidForSecondGrantee: BigNumber;

        before(async () => {
          const {
            token,
            grantFromDonor,
            grantFromManager,
            granteeWallet,
            secondGranteeWallet
          } = await waffle.loadFixture(fixtureWithMultipleGrantee);

          _grantFromDonor = grantFromDonor;
          _grantFromManager = grantFromManager;
          _granteeWallet = granteeWallet;
          _secondGranteeWallet = secondGranteeWallet;

          await token.approve(grantFromDonor.address, TARGET_FUNDING);
          await _grantFromDonor.fund(TARGET_FUNDING);

          const { totalPaid: initialtotalPaidForGrantee } = await _grantFromManager
            .grantees(_granteeWallet.address);
          
          _lasttotalPaidForGrantee = initialtotalPaidForGrantee;

          const { totalPaid: initialtotalPaidForSecondGrantee } = await _grantFromManager
            .grantees(_secondGranteeWallet.address);

          _lasttotalPaidForSecondGrantee = initialtotalPaidForSecondGrantee;
        });

        it("should revert if approved amount is 0", async () => {
          await expect(_grantFromManager.approvePayout(0, _granteeWallet.address))
            .to.be.reverted;
        });

        it("should update payoutApproved & totalPaid on first approval / withdrawl", async () => {
          let approveAmount = 5e2;

          // for 1st Grantee
          const initialtotalPaidForGrantee = _lasttotalPaidForGrantee;
          await _grantFromManager.approvePayout(approveAmount, _granteeWallet.address);
          await _grantFromManager.withdrawPayout(_granteeWallet.address);

          const {
            totalPaid: finaltotalPaidForGrantee,
            payoutApproved: payoutApprovedGrantee
          } = await _grantFromManager.grantees(_granteeWallet.address);

          expect(initialtotalPaidForGrantee.add(approveAmount))
            .to.be.eq(finaltotalPaidForGrantee);

          expect(payoutApprovedGrantee)
            .to.be.eq(finaltotalPaidForGrantee);
          
          _lasttotalPaidForGrantee = finaltotalPaidForGrantee;

          // for 2nd Grantee
          approveAmount = 250;
          const initialtotalPaidForSecondGrantee = _lasttotalPaidForSecondGrantee;

          await _grantFromManager.approvePayout(approveAmount, _secondGranteeWallet.address);
          await _grantFromManager.withdrawPayout(_secondGranteeWallet.address);

          const {
            totalPaid: finaltotalPaidForSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee
          } = await _grantFromManager.grantees(_secondGranteeWallet.address);


          expect(initialtotalPaidForSecondGrantee.add(approveAmount))
            .to.eq(finaltotalPaidForSecondGrantee);

          expect(payoutApprovedSecondGrantee)
            .to.eq(finaltotalPaidForSecondGrantee);

          _lasttotalPaidForSecondGrantee = finaltotalPaidForSecondGrantee;
        });

        it("should update payoutApproved & totalPaid on second approval / withdrawl", async () => {
          let approveAmount = 250;

          const initialtotalPaidForGrantee = _lasttotalPaidForGrantee;
          await _grantFromManager.approvePayout(approveAmount, _granteeWallet.address);
          await _grantFromManager.withdrawPayout(_granteeWallet.address);

          const {
            totalPaid: finaltotalPaidForGrantee,
            payoutApproved: payoutApprovedGrantee
          } = await _grantFromManager.grantees(_granteeWallet.address);

          expect(initialtotalPaidForGrantee.add(approveAmount))
            .to.be.eq(finaltotalPaidForGrantee);
          
          expect(payoutApprovedGrantee)
            .to.be.eq(finaltotalPaidForGrantee);
          
            _lasttotalPaidForGrantee = finaltotalPaidForGrantee;

          approveAmount = 200;

          const initialtotalPaidForSecondGrantee = _lasttotalPaidForSecondGrantee;
          await _grantFromManager.approvePayout(approveAmount, _secondGranteeWallet.address);
          await _grantFromManager.withdrawPayout(_secondGranteeWallet.address);

          const {
            totalPaid: finaltotalPaidForSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee
          } = await _grantFromManager.grantees(
            _secondGranteeWallet.address
          );

          expect(initialtotalPaidForSecondGrantee.add(approveAmount))
            .to.eq(finaltotalPaidForSecondGrantee);
          expect(payoutApprovedSecondGrantee)
            .to.eq(finaltotalPaidForSecondGrantee);

          _lasttotalPaidForSecondGrantee = finaltotalPaidForSecondGrantee;
        });

        it("should update payoutApproved & totalPaid on third approval / withdrawl", async () => {
          let approveAmount = 250;

          const initialtotalPaidForGrantee = _lasttotalPaidForGrantee;
          await _grantFromManager.approvePayout(approveAmount, _granteeWallet.address);
          await _grantFromManager.withdrawPayout(_granteeWallet.address);

          const {
            totalPaid: finaltotalPaidForGrantee,
            payoutApproved: payoutApprovedGrantee
          } = await _grantFromManager.grantees(_granteeWallet.address);

          expect(initialtotalPaidForGrantee.add(approveAmount))
            .to.be.eq(finaltotalPaidForGrantee);
          expect(payoutApprovedGrantee)
            .to.be.eq(finaltotalPaidForGrantee);


          _lasttotalPaidForGrantee = finaltotalPaidForGrantee;

          approveAmount = 50;

          const initialtotalPaidForSecondGrantee = _lasttotalPaidForSecondGrantee;
          await _grantFromManager.approvePayout(approveAmount, _secondGranteeWallet.address);
          await _grantFromManager.withdrawPayout(_secondGranteeWallet.address);

          const {
            totalPaid: finaltotalPaidForSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee
          } = await _grantFromManager.grantees(_secondGranteeWallet.address);

          expect(initialtotalPaidForSecondGrantee.add(approveAmount))
            .to.eq(finaltotalPaidForSecondGrantee);
          expect(payoutApprovedSecondGrantee)
            .to.eq(finaltotalPaidForSecondGrantee);

          _lasttotalPaidForSecondGrantee = finaltotalPaidForSecondGrantee;
        });

        it("should revert when approval surpasses remaining allocation", async () => {
          const approveAmount = 250;

          await expect(_grantFromManager.approvePayout(approveAmount, _granteeWallet.address))
            .to.be.revertedWith(
              "approvePayout::Invalid Argument. value cannot exceed remaining allocation."
            );

          await expect(_grantFromManager.approvePayout(approveAmount, _secondGranteeWallet.address))
            .to.be.revertedWith(
              "approvePayout::Invalid Argument. value cannot exceed remaining allocation."
            );
        });
      });
    });

    describe("With Ether", () => {
      describe("Grantees' Balance", () => {
        let _granteeWallet: Wallet, _secondGranteeWallet: Wallet;
        let _grantFromManagerWithEther: Contract;
        let etherBalanceOfGrantee: BigNumber, etherBalanceOfSecondGrantee: BigNumber;
        let totalPaidOfGrantee: BigNumber, totalPaidOfSecondGrantee: BigNumber;
        let _provider: any;
        before(async () => {
          const {
            granteeWallet,
            secondGranteeWallet,
            donorWallet,
            provider,
            grantFromManagerWithEther
          } = await waffle.loadFixture(fixtureWithMultipleGrantee);

          _granteeWallet = granteeWallet;
          _secondGranteeWallet = secondGranteeWallet;
          _grantFromManagerWithEther = grantFromManagerWithEther;
          _provider = provider;

          // Donor fund Ether
          await donorWallet.sendTransaction({
            to: grantFromManagerWithEther.address,
            value: 1e6,
            gasPrice: 1
          });

          etherBalanceOfGrantee = await _provider.getBalance(_granteeWallet.address);

          const {
            totalPaid: _totalPaidOfGrantee,
            payoutApproved: payoutApprovedGrantee
          } = await _grantFromManagerWithEther.grantees(_granteeWallet.address);

          totalPaidOfGrantee = _totalPaidOfGrantee;

          etherBalanceOfSecondGrantee = await _provider.getBalance(_secondGranteeWallet.address);
          
          const {
            totalPaid: _totalPaidOfSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee
          } = await _grantFromManagerWithEther.grantees(_secondGranteeWallet.address);

          totalPaidOfSecondGrantee = _totalPaidOfSecondGrantee;
        });

        it("should be updated with initial payout", async () => {
          // first grantee
          await _grantFromManagerWithEther.approvePayout(900, _granteeWallet.address);
          await _grantFromManagerWithEther.withdrawPayout(_granteeWallet.address);

          const _etherBalanceOfGrantee = await _provider.getBalance(_granteeWallet.address);
          expect(etherBalanceOfGrantee.add(900)).to.be.eq(_etherBalanceOfGrantee);

          const {
            totalPaid: _totalPaidOfGrantee,
            payoutApproved: payoutApprovedGrantee
          } = await _grantFromManagerWithEther.grantees(_granteeWallet.address);
          expect(totalPaidOfGrantee.add(900)).to.be.eq(_totalPaidOfGrantee);
          expect(payoutApprovedGrantee).to.be.eq(_totalPaidOfGrantee);

          // second grantee
          await _grantFromManagerWithEther.approvePayout(300, _secondGranteeWallet.address);
          await _grantFromManagerWithEther.withdrawPayout(_secondGranteeWallet.address);

          const {
            totalPaid: _totalPaidOfSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee
          } = await _grantFromManagerWithEther.grantees(_secondGranteeWallet.address);

          expect(totalPaidOfSecondGrantee.add(300)).to.be.eq(_totalPaidOfSecondGrantee);
          expect(payoutApprovedSecondGrantee).to.be.eq(_totalPaidOfSecondGrantee);

          const _etherBalanceOfSecondGrantee = await _provider.getBalance(_secondGranteeWallet.address);
          expect(etherBalanceOfSecondGrantee.add(300)).to.be.eq(_etherBalanceOfSecondGrantee);

          etherBalanceOfGrantee = _etherBalanceOfGrantee;
          etherBalanceOfSecondGrantee = _etherBalanceOfSecondGrantee;

          totalPaidOfGrantee = _totalPaidOfGrantee;
          totalPaidOfSecondGrantee = _totalPaidOfSecondGrantee;
        });

        it("should be updated with final payout", async () => {
          // first grantee
          await _grantFromManagerWithEther.approvePayout(100, _granteeWallet.address);
          await _grantFromManagerWithEther.withdrawPayout(_granteeWallet.address);

          const _etherBalanceOfGrantee = await _provider.getBalance(_granteeWallet.address);
          expect(etherBalanceOfGrantee.add(100)).to.be.eq(_etherBalanceOfGrantee);

          const {
            totalPaid: _totalPaidOfGrantee,
            payoutApproved: payoutApprovedGrantee
          } = await _grantFromManagerWithEther.grantees(_granteeWallet.address);

          expect(totalPaidOfGrantee.add(100)).to.be.eq(_totalPaidOfGrantee);
          expect(payoutApprovedGrantee).to.be.eq(_totalPaidOfGrantee);

          // second grantee
          await _grantFromManagerWithEther.approvePayout(200, _secondGranteeWallet.address);
          await _grantFromManagerWithEther.withdrawPayout(_secondGranteeWallet.address);

          const {
            totalPaid: _totalPaidOfSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee
          } = await _grantFromManagerWithEther.grantees(_secondGranteeWallet.address);

          expect(totalPaidOfSecondGrantee.add(200)).to.be.eq(_totalPaidOfSecondGrantee);
          expect(payoutApprovedSecondGrantee).to.be.eq(_totalPaidOfSecondGrantee);

          const _etherBalanceOfSecondGrantee = await _provider.getBalance(_secondGranteeWallet.address);
          expect(etherBalanceOfSecondGrantee.add(200)).to.be.eq(_etherBalanceOfSecondGrantee);

          etherBalanceOfGrantee = _etherBalanceOfGrantee;
          etherBalanceOfSecondGrantee = _etherBalanceOfSecondGrantee;

          totalPaidOfGrantee = _totalPaidOfGrantee;
          totalPaidOfSecondGrantee = _totalPaidOfSecondGrantee;
        });
      });
    });
  });
});
