import chai from 'chai';
import * as waffle from 'ethereum-waffle';
import { Contract, Wallet, constants, Signer } from 'ethers';
import { BigNumber } from 'ethers/utils/bignumber';
import { Web3Provider, Provider } from 'ethers/providers';
import { bigNumberify, randomBytes, solidityKeccak256, id } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import { helpers } from '../helpers/helpers';
import bre from '@nomiclabs/buidler';

const { fixture, fixtureWithMultipleGrantee } = helpers.fixtures;
const { TARGET_FUNDING, TARGET_FUNDING_1, AMOUNTS_1 } = helpers.constants;

chai.use(waffle.solidity);
const { expect, assert } = chai;

describe('Grant-Payout', () => {
  describe('With Token', () => {
    describe('Approve Payout', () => {
      let _grantFromDonorWithToken: Contract;
      const _fundAmount = 500;
      const _payoutAmount = _fundAmount;
      let _grantFromManagerWithToken: Contract;
      let _granteeWallet: Signer;
      let _unknownWallet: Signer;

      before(async () => {
        const {
          tokenFromDonor,
          grantFromDonorWithToken,
          grantFromManagerWithToken,
          granteeWallet,
          unknownWallet,
        } = await fixture(bre);

        _grantFromDonorWithToken = grantFromDonorWithToken;
        _grantFromManagerWithToken = grantFromManagerWithToken;
        _granteeWallet = granteeWallet;
        _unknownWallet = unknownWallet;

        await tokenFromDonor.approve(grantFromDonorWithToken.address, 1000);
        await (await _grantFromDonorWithToken.fund(_fundAmount)).wait();
      });

      it('should revert if someone other than manager tries to approve payout', async () => {
        await expect(
          _grantFromDonorWithToken.approvePayout(
            _fundAmount,
            await _granteeWallet.getAddress(),
          ),
        ).to.be.revertedWith(
          'onlyManager::Permission Error. Function can only be called by manager.',
        );
      });

      it('should revert if target funding != total funding', async () => {
        await expect(
          _grantFromManagerWithToken.approvePayout(
            _fundAmount,
            await _granteeWallet.getAddress(),
          ),
        ).to.be.revertedWith(
          'approvePayout::Status Error. Cannot approve if funding target not met.',
        );
      });

      it('should the target funding  == total funding', async () => {
        const targetFunding = await _grantFromDonorWithToken.targetFunding();
        let totalFunding = await _grantFromDonorWithToken.totalFunding();
        await _grantFromDonorWithToken.fund(targetFunding - totalFunding);

        totalFunding = await _grantFromDonorWithToken.totalFunding();
        expect(targetFunding).to.be.eq(totalFunding);
      });

      it('should revert if value > target funding', async () => {
        const { targetFunding } = await _grantFromManagerWithToken.grantees(
          await _granteeWallet.getAddress(),
        );
        await expect(
          _grantFromManagerWithToken.approvePayout(
            targetFunding + 1,
            await _granteeWallet.getAddress(),
          ),
        ).to.be.revertedWith(
          'approvePayout::Invalid Argument. value cannot exceed remaining allocation.',
        );
      });

      it('should revert if address does not belongs to grantee', async () => {
        await expect(
          _grantFromManagerWithToken.approvePayout(
            _payoutAmount,
            await _unknownWallet.getAddress(),
          ),
        ).to.be.revertedWith(
          'approvePayout::Invalid Argument. value cannot exceed remaining allocation.',
        );
      });

      it('should emit LogPaymentApproval on approve payment', async () => {
        await expect(
          _grantFromManagerWithToken.approvePayout(
            _payoutAmount,
            await _granteeWallet.getAddress(),
          ),
        )
          .to.emit(_grantFromManagerWithToken, 'LogPaymentApproval')
          .withArgs(await _granteeWallet.getAddress(), _payoutAmount);
      });

      it('should emit LogPayment on payment withdrawl', async () => {
        await expect(
          _grantFromManagerWithToken.withdrawPayout(
            await _granteeWallet.getAddress(),
          ),
        )
          .to.emit(_grantFromManagerWithToken, 'LogPayment')
          .withArgs(await _granteeWallet.getAddress(), _payoutAmount);
      });

      it('should update total payed of grantee and Grant', async () => {
        const totalPaidOfGrant = await _grantFromManagerWithToken.totalPaid();

        const { totalPaid } = await _grantFromManagerWithToken.grantees(
          await _granteeWallet.getAddress(),
        );

        expect(totalPaidOfGrant).to.be.eq(totalPaid);
        expect(totalPaid).to.be.eq(_payoutAmount);
      });

      // always at last
      it('should revert if grant is already cancelled', async () => {
        await _grantFromManagerWithToken.cancelGrant();
        await expect(
          _grantFromManagerWithToken.approvePayout(
            _fundAmount,
            await _granteeWallet.getAddress(),
          ),
        ).to.be.revertedWith(
          'approvePayout::Status Error. Cannot approve if grant is cancelled.',
        );
      });
    });

    describe('Grantee balance', () => {
      let _grantFromDonorWithToken: Contract;
      const _fundAmount = 5e2;
      const _payoutAmount = _fundAmount;
      let _grantFromManagerWithToken: Contract;
      let _granteeWallet: Signer;
      let _tokenFromDonor: Contract;

      before(async () => {
        const {
          tokenFromDonor,
          grantFromDonorWithToken,
          grantFromManagerWithToken,
          granteeWallet,
        } = await fixture(bre);

        _grantFromDonorWithToken = grantFromDonorWithToken;
        _grantFromManagerWithToken = grantFromManagerWithToken;
        _granteeWallet = granteeWallet;
        _tokenFromDonor = tokenFromDonor;

        await tokenFromDonor.approve(
          grantFromDonorWithToken.address,
          TARGET_FUNDING,
        );
        await _grantFromDonorWithToken.fund(TARGET_FUNDING);
      });

      it('should not be updated yet', async () => {
        const tokenBalance = await _tokenFromDonor.balanceOf(
          await _granteeWallet.getAddress(),
        );
        expect(tokenBalance).to.eq(0);

        const { totalPaid } = await _grantFromManagerWithToken.grantees(
          await _granteeWallet.getAddress(),
        );
        expect(0).to.eq(totalPaid);
      });

      it('should updated with token after payout withdrawl', async () => {
        await _grantFromManagerWithToken.approvePayout(
          _payoutAmount,
          await _granteeWallet.getAddress(),
        );
        await _grantFromManagerWithToken.withdrawPayout(
          await _granteeWallet.getAddress(),
        );

        const tokenBalance = await _tokenFromDonor.balanceOf(
          await _granteeWallet.getAddress(),
        );
        expect(tokenBalance).to.eq(_payoutAmount);

        const { totalPaid } = await _grantFromManagerWithToken.grantees(
          await _granteeWallet.getAddress(),
        );
        expect(_payoutAmount).to.eq(totalPaid);
      });
    });
  });

  describe('With Ether', () => {
    describe('Grantee balance', () => {
      let _grantFromDonorWithEther: Contract;
      let _grantFromManagerWithEther: Contract;
      const _fundAmount = 5e2;
      const _payoutAmount = _fundAmount / 2;
      let _donorWallet: Signer;
      let _granteeWallet: Signer;
      let _provider: any;
      let _initialEtherBalance: any;

      before(async () => {
        const {
          grantFromDonorWithEther,
          grantFromManagerWithEther,
          donorWallet,
          granteeWallet,
          provider,
        } = await fixture(bre);

        _donorWallet = donorWallet;
        _granteeWallet = granteeWallet;
        _grantFromDonorWithEther = grantFromDonorWithEther;
        _grantFromManagerWithEther = grantFromManagerWithEther;
        _provider = provider;

        // Donor fund Ether
        await _donorWallet.sendTransaction({
          to: _grantFromDonorWithEther.address,
          value: 1e6,
          gasPrice: 1,
        });

        _initialEtherBalance = await _provider.getBalance(
          await _granteeWallet.getAddress(),
        );
      });

      it('should not be updated yet', async () => {
        const etherBalance = await _provider.getBalance(
          await _granteeWallet.getAddress(),
        );
        expect(_initialEtherBalance).eq(etherBalance);

        const { totalPaid } = await _grantFromManagerWithEther.grantees(
          await _granteeWallet.getAddress(),
        );
        expect(0).to.eq(totalPaid);
      });

      it('should updated approved amount approve payout', async () => {
        await _grantFromManagerWithEther.approvePayout(
          _payoutAmount,
          await _granteeWallet.getAddress(),
        );

        const { payoutApproved } = await _grantFromManagerWithEther.grantees(
          await _granteeWallet.getAddress(),
        );
        expect(_payoutAmount).eq(payoutApproved);
      });

      it('should updated ether after withdrawl', async () => {
        await _grantFromManagerWithEther.withdrawPayout(
          await _granteeWallet.getAddress(),
        );

        const { totalPaid } = await _grantFromManagerWithEther.grantees(
          await _granteeWallet.getAddress(),
        );
        expect(_payoutAmount).eq(totalPaid);

        const etherBalanceAfterPayout = await _provider.getBalance(
          await _granteeWallet.getAddress(),
        );
        expect(_initialEtherBalance.add(_payoutAmount)).eq(
          etherBalanceAfterPayout,
        );
      });
    });
  });

  describe('When there are multiple payments to multiple grantees', () => {
    describe('With Token', () => {
      describe("Grantees' balance", () => {
        let _grantFromDonor: Contract;
        let _grantFromManager: Contract;
        let _granteeWallet: Signer;
        let _secondGranteeWallet: Signer;
        let _lasttotalPaidForGrantee: BigNumber;
        let _lasttotalPaidForSecondGrantee: BigNumber;

        before(async () => {
          const {
            tokenFromDonor,
            grantFromDonorWithToken,
            grantFromManagerWithToken,
            granteeWallet,
            secondGranteeWallet,
          } = await fixtureWithMultipleGrantee(bre);

          _grantFromDonor = grantFromDonorWithToken;
          _grantFromManager = grantFromManagerWithToken;
          _granteeWallet = granteeWallet;
          _secondGranteeWallet = secondGranteeWallet;

          await tokenFromDonor.approve(
            grantFromDonorWithToken.address,
            TARGET_FUNDING_1,
          );
          await _grantFromDonor.fund(TARGET_FUNDING_1);

          const {
            totalPaid: initialtotalPaidForGrantee,
          } = await _grantFromManager.grantees(
            await _granteeWallet.getAddress(),
          );

          _lasttotalPaidForGrantee = initialtotalPaidForGrantee;

          const {
            totalPaid: initialtotalPaidForSecondGrantee,
          } = await _grantFromManager.grantees(
            await _secondGranteeWallet.getAddress(),
          );

          _lasttotalPaidForSecondGrantee = initialtotalPaidForSecondGrantee;
        });

        it('should revert if approved amount is 0', async () => {
          await expect(
            _grantFromManager.approvePayout(
              0,
              await _granteeWallet.getAddress(),
            ),
          ).to.be.reverted;
        });

        it('should update payoutApproved & totalPaid on first approval / withdrawl', async () => {
          let approveAmount = 5e2;

          // for 1st Grantee
          const initialtotalPaidForGrantee = _lasttotalPaidForGrantee;
          await _grantFromManager.approvePayout(
            approveAmount,
            await _granteeWallet.getAddress(),
          );
          await _grantFromManager.withdrawPayout(
            await _granteeWallet.getAddress(),
          );

          const {
            totalPaid: finaltotalPaidForGrantee,
            payoutApproved: payoutApprovedGrantee,
          } = await _grantFromManager.grantees(
            await _granteeWallet.getAddress(),
          );

          expect(initialtotalPaidForGrantee.add(approveAmount)).to.be.eq(
            finaltotalPaidForGrantee,
          );

          expect(payoutApprovedGrantee).to.be.eq(finaltotalPaidForGrantee);

          _lasttotalPaidForGrantee = finaltotalPaidForGrantee;

          // for 2nd Grantee
          approveAmount = 250;
          const initialtotalPaidForSecondGrantee = _lasttotalPaidForSecondGrantee;

          await _grantFromManager.approvePayout(
            approveAmount,
            await _secondGranteeWallet.getAddress(),
          );
          await _grantFromManager.withdrawPayout(
            await _secondGranteeWallet.getAddress(),
          );

          const {
            totalPaid: finaltotalPaidForSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee,
          } = await _grantFromManager.grantees(
            await _secondGranteeWallet.getAddress(),
          );

          expect(initialtotalPaidForSecondGrantee.add(approveAmount)).to.eq(
            finaltotalPaidForSecondGrantee,
          );

          expect(payoutApprovedSecondGrantee).to.eq(
            finaltotalPaidForSecondGrantee,
          );

          _lasttotalPaidForSecondGrantee = finaltotalPaidForSecondGrantee;
        });

        it('should update payoutApproved & totalPaid on second approval / withdrawl', async () => {
          let approveAmount = 250;

          const initialtotalPaidForGrantee = _lasttotalPaidForGrantee;
          await _grantFromManager.approvePayout(
            approveAmount,
            await _granteeWallet.getAddress(),
          );
          await _grantFromManager.withdrawPayout(
            await _granteeWallet.getAddress(),
          );

          const {
            totalPaid: finaltotalPaidForGrantee,
            payoutApproved: payoutApprovedGrantee,
          } = await _grantFromManager.grantees(
            await _granteeWallet.getAddress(),
          );

          expect(initialtotalPaidForGrantee.add(approveAmount)).to.be.eq(
            finaltotalPaidForGrantee,
          );

          expect(payoutApprovedGrantee).to.be.eq(finaltotalPaidForGrantee);

          _lasttotalPaidForGrantee = finaltotalPaidForGrantee;

          approveAmount = 200;

          const initialtotalPaidForSecondGrantee = _lasttotalPaidForSecondGrantee;
          await _grantFromManager.approvePayout(
            approveAmount,
            await _secondGranteeWallet.getAddress(),
          );
          await _grantFromManager.withdrawPayout(
            await _secondGranteeWallet.getAddress(),
          );

          const {
            totalPaid: finaltotalPaidForSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee,
          } = await _grantFromManager.grantees(
            await _secondGranteeWallet.getAddress(),
          );

          expect(initialtotalPaidForSecondGrantee.add(approveAmount)).to.eq(
            finaltotalPaidForSecondGrantee,
          );
          expect(payoutApprovedSecondGrantee).to.eq(
            finaltotalPaidForSecondGrantee,
          );

          _lasttotalPaidForSecondGrantee = finaltotalPaidForSecondGrantee;
        });

        it('should update payoutApproved & totalPaid on third approval / withdrawl', async () => {
          let approveAmount = 250;

          const initialtotalPaidForGrantee = _lasttotalPaidForGrantee;
          await _grantFromManager.approvePayout(
            approveAmount,
            await _granteeWallet.getAddress(),
          );
          await _grantFromManager.withdrawPayout(
            await _granteeWallet.getAddress(),
          );

          const {
            totalPaid: finaltotalPaidForGrantee,
            payoutApproved: payoutApprovedGrantee,
          } = await _grantFromManager.grantees(
            await _granteeWallet.getAddress(),
          );

          expect(initialtotalPaidForGrantee.add(approveAmount)).to.be.eq(
            finaltotalPaidForGrantee,
          );
          expect(payoutApprovedGrantee).to.be.eq(finaltotalPaidForGrantee);

          _lasttotalPaidForGrantee = finaltotalPaidForGrantee;

          approveAmount = 50;

          const initialtotalPaidForSecondGrantee = _lasttotalPaidForSecondGrantee;
          await _grantFromManager.approvePayout(
            approveAmount,
            await _secondGranteeWallet.getAddress(),
          );
          await _grantFromManager.withdrawPayout(
            await _secondGranteeWallet.getAddress(),
          );

          const {
            totalPaid: finaltotalPaidForSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee,
          } = await _grantFromManager.grantees(
            await _secondGranteeWallet.getAddress(),
          );

          expect(initialtotalPaidForSecondGrantee.add(approveAmount)).to.eq(
            finaltotalPaidForSecondGrantee,
          );
          expect(payoutApprovedSecondGrantee).to.eq(
            finaltotalPaidForSecondGrantee,
          );

          _lasttotalPaidForSecondGrantee = finaltotalPaidForSecondGrantee;
        });

        it('should revert when approval surpasses remaining allocation', async () => {
          await expect(
            _grantFromManager.approvePayout(
              AMOUNTS_1[0] + 1,
              await _granteeWallet.getAddress(),
            ),
          ).to.be.revertedWith(
            'approvePayout::Invalid Argument. value cannot exceed remaining allocation.',
          );

          await expect(
            _grantFromManager.approvePayout(
              AMOUNTS_1[1] + 1,
              await _secondGranteeWallet.getAddress(),
            ),
          ).to.be.revertedWith(
            'approvePayout::Invalid Argument. value cannot exceed remaining allocation.',
          );
        });
      });
    });

    describe('With Ether', () => {
      describe("Grantees' Balance", () => {
        let _granteeWallet: Signer, _secondGranteeWallet: Signer;
        let _grantFromManagerWithEther: Contract;
        let etherBalanceOfGrantee: BigNumber,
          etherBalanceOfSecondGrantee: BigNumber;
        let totalPaidOfGrantee: BigNumber, totalPaidOfSecondGrantee: BigNumber;
        let _provider: any;
        before(async () => {
          const {
            granteeWallet,
            secondGranteeWallet,
            donorWallet,
            provider,
            grantFromManagerWithEther,
          } = await fixtureWithMultipleGrantee(bre);

          _granteeWallet = granteeWallet;
          _secondGranteeWallet = secondGranteeWallet;
          _grantFromManagerWithEther = grantFromManagerWithEther;
          _provider = provider;

          // Donor fund Ether
          await donorWallet.sendTransaction({
            to: grantFromManagerWithEther.address,
            value: 1e6,
            gasPrice: 1,
          });

          etherBalanceOfGrantee = await _provider.getBalance(
            await _granteeWallet.getAddress(),
          );

          const {
            totalPaid: _totalPaidOfGrantee,
            payoutApproved: payoutApprovedGrantee,
          } = await _grantFromManagerWithEther.grantees(
            await _granteeWallet.getAddress(),
          );

          totalPaidOfGrantee = _totalPaidOfGrantee;

          etherBalanceOfSecondGrantee = await _provider.getBalance(
            await _secondGranteeWallet.getAddress(),
          );

          const {
            totalPaid: _totalPaidOfSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee,
          } = await _grantFromManagerWithEther.grantees(
            await _secondGranteeWallet.getAddress(),
          );

          totalPaidOfSecondGrantee = _totalPaidOfSecondGrantee;
        });

        it('should be updated with initial payout', async () => {
          // first grantee
          await _grantFromManagerWithEther.approvePayout(
            900,
            await _granteeWallet.getAddress(),
          );
          await _grantFromManagerWithEther.withdrawPayout(
            await _granteeWallet.getAddress(),
          );

          const _etherBalanceOfGrantee = await _provider.getBalance(
            await _granteeWallet.getAddress(),
          );
          expect(etherBalanceOfGrantee.add(900)).to.be.eq(
            _etherBalanceOfGrantee,
          );

          const {
            totalPaid: _totalPaidOfGrantee,
            payoutApproved: payoutApprovedGrantee,
          } = await _grantFromManagerWithEther.grantees(
            await _granteeWallet.getAddress(),
          );
          expect(totalPaidOfGrantee.add(900)).to.be.eq(_totalPaidOfGrantee);
          expect(payoutApprovedGrantee).to.be.eq(_totalPaidOfGrantee);

          // second grantee
          await _grantFromManagerWithEther.approvePayout(
            300,
            await _secondGranteeWallet.getAddress(),
          );
          await _grantFromManagerWithEther.withdrawPayout(
            await _secondGranteeWallet.getAddress(),
          );

          const {
            totalPaid: _totalPaidOfSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee,
          } = await _grantFromManagerWithEther.grantees(
            await _secondGranteeWallet.getAddress(),
          );

          expect(totalPaidOfSecondGrantee.add(300)).to.be.eq(
            _totalPaidOfSecondGrantee,
          );
          expect(payoutApprovedSecondGrantee).to.be.eq(
            _totalPaidOfSecondGrantee,
          );

          const _etherBalanceOfSecondGrantee = await _provider.getBalance(
            await _secondGranteeWallet.getAddress(),
          );
          expect(etherBalanceOfSecondGrantee.add(300)).to.be.eq(
            _etherBalanceOfSecondGrantee,
          );

          etherBalanceOfGrantee = _etherBalanceOfGrantee;
          etherBalanceOfSecondGrantee = _etherBalanceOfSecondGrantee;

          totalPaidOfGrantee = _totalPaidOfGrantee;
          totalPaidOfSecondGrantee = _totalPaidOfSecondGrantee;
        });

        it('should be updated with final payout', async () => {
          // first grantee
          await _grantFromManagerWithEther.approvePayout(
            100,
            await _granteeWallet.getAddress(),
          );
          await _grantFromManagerWithEther.withdrawPayout(
            await _granteeWallet.getAddress(),
          );

          const _etherBalanceOfGrantee = await _provider.getBalance(
            await _granteeWallet.getAddress(),
          );
          expect(etherBalanceOfGrantee.add(100)).to.be.eq(
            _etherBalanceOfGrantee,
          );

          const {
            totalPaid: _totalPaidOfGrantee,
            payoutApproved: payoutApprovedGrantee,
          } = await _grantFromManagerWithEther.grantees(
            await _granteeWallet.getAddress(),
          );

          expect(totalPaidOfGrantee.add(100)).to.be.eq(_totalPaidOfGrantee);
          expect(payoutApprovedGrantee).to.be.eq(_totalPaidOfGrantee);

          // second grantee
          await _grantFromManagerWithEther.approvePayout(
            200,
            await _secondGranteeWallet.getAddress(),
          );
          await _grantFromManagerWithEther.withdrawPayout(
            await _secondGranteeWallet.getAddress(),
          );

          const {
            totalPaid: _totalPaidOfSecondGrantee,
            payoutApproved: payoutApprovedSecondGrantee,
          } = await _grantFromManagerWithEther.grantees(
            await _secondGranteeWallet.getAddress(),
          );

          expect(totalPaidOfSecondGrantee.add(200)).to.be.eq(
            _totalPaidOfSecondGrantee,
          );
          expect(payoutApprovedSecondGrantee).to.be.eq(
            _totalPaidOfSecondGrantee,
          );

          const _etherBalanceOfSecondGrantee = await _provider.getBalance(
            await _secondGranteeWallet.getAddress(),
          );
          expect(etherBalanceOfSecondGrantee.add(200)).to.be.eq(
            _etherBalanceOfSecondGrantee,
          );

          etherBalanceOfGrantee = _etherBalanceOfGrantee;
          etherBalanceOfSecondGrantee = _etherBalanceOfSecondGrantee;

          totalPaidOfGrantee = _totalPaidOfGrantee;
          totalPaidOfSecondGrantee = _totalPaidOfSecondGrantee;
        });
      });
    });
  });
});
