import chai from 'chai';
import * as waffle from 'ethereum-waffle';
import { Contract, Wallet, constants, Signer } from 'ethers';
import { BigNumber } from 'ethers/utils/bignumber';
import { AddressZero, Zero } from 'ethers/constants';
import { helpers } from '../helpers/helpers';
import bre from '@nomiclabs/buidler';

const { fixture, fixtureWithMultipleGrantee } = helpers.fixtures;
const { TARGET_FUNDING_1, AMOUNTS_1 } = helpers.constants;
const FUND_AMOUNT = TARGET_FUNDING_1 / 2;
const REFUND_AMOUNT = TARGET_FUNDING_1 / 4;

chai.use(waffle.solidity);
const { expect } = chai;

describe('Grant-Refunds-MultipleDonors', () => {
  describe('With multiple donors & grantee', () => {
    describe(`Handling correct dilution for fund -> approve refund -> withdraw refund 
                        - payout -> appove refund & withdraw refund`, () => {
      let _grantFromDonor: Contract;
      let _grantFromSecondDonor: Contract;
      let _grantFromManager: Contract;
      let _token: Contract;

      let _donorWallet: Signer;
      let _secondDonorWallet: Signer;
      let _granteeWallet: Signer;
      let _secondGranteeWallet: Signer;

      before(async () => {
        const {
          tokenFromDonor,
          tokenFromSecondDonor,
          grantFromDonorWithToken,
          grantFromSecondDonorWithToken,
          grantFromManagerWithToken,
          donorWallet,
          secondDonorWallet,
          granteeWallet,
          secondGranteeWallet,
        } = await fixtureWithMultipleGrantee(bre);

        _grantFromDonor = grantFromDonorWithToken;
        _grantFromSecondDonor = grantFromSecondDonorWithToken;
        _donorWallet = donorWallet;
        _secondDonorWallet = secondDonorWallet;
        _grantFromManager = grantFromManagerWithToken;
        _granteeWallet = granteeWallet;
        _secondGranteeWallet = secondGranteeWallet;
        _token = tokenFromDonor;

        await tokenFromDonor.approve(grantFromDonorWithToken.address, 1e6);
        await tokenFromSecondDonor.approve(
          grantFromDonorWithToken.address,
          1e6,
        );
      });

      it('should update total funding of grant', async () => {
        // funding by multiple donors
        await _grantFromDonor.fund(FUND_AMOUNT);
        await _grantFromSecondDonor.fund(FUND_AMOUNT);

        const balanceAfterFundingForGrant = await _token.balanceOf(
          _grantFromManager.address,
        );
        expect(FUND_AMOUNT * 2).to.eq(balanceAfterFundingForGrant);
      });

      it('should update total refunded on approval of refunding', async () => {
        const totalRefundedBeforeApproveRefund = await _grantFromManager.totalRefunded();
        await _grantFromManager.approveRefund(REFUND_AMOUNT, AddressZero);
        const totalRefundedAfterApproveRefund = await _grantFromManager.totalRefunded();
        expect(totalRefundedBeforeApproveRefund.add(REFUND_AMOUNT)).to.eq(
          totalRefundedAfterApproveRefund,
        );
      });

      it('should update balance of donor and grant on withdraw refund to multiple donors', async () => {
        const balanceBeforeRefundForGrant = await _token.balanceOf(
          _grantFromManager.address,
        );

        // first donor
        const balanceBeforeRefundForDonor = await _token.balanceOf(
          await _donorWallet.getAddress(),
        );
        await _grantFromDonor.withdrawRefund(await _donorWallet.getAddress());
        const balanceAfterRefundForDonor = await _token.balanceOf(
          await _donorWallet.getAddress(),
        );
        expect(balanceBeforeRefundForDonor.add(REFUND_AMOUNT / 2)).to.eq(
          balanceAfterRefundForDonor,
        );

        // second donor
        const balanceBeforeRefundForSecondDonor = await _token.balanceOf(
          await _secondDonorWallet.getAddress(),
        );
        await _grantFromDonor.withdrawRefund(
          await _secondDonorWallet.getAddress(),
        );
        const balanceAfterRefundForSecondDonor = await _token.balanceOf(
          await _secondDonorWallet.getAddress(),
        );
        expect(balanceBeforeRefundForSecondDonor.add(REFUND_AMOUNT / 2)).to.eq(
          balanceAfterRefundForSecondDonor,
        );

        // Checking Grant's token balance
        const balanceAfterRefundForGrant = await _token.balanceOf(
          _grantFromManager.address,
        );
        expect(balanceBeforeRefundForGrant.sub(REFUND_AMOUNT)).to.eq(
          balanceAfterRefundForGrant,
        );
      });

      it('should update balances of multiple grantees and Grant on payout & withdrawl', async () => {
        const balanceBeforePayoutForGrant = await _token.balanceOf(
          _grantFromManager.address,
        );

        // first grantee
        const balanceBeforePayoutForGrantee = await _token.balanceOf(
          await _granteeWallet.getAddress(),
        );
        await _grantFromManager.approvePayout(
          REFUND_AMOUNT,
          await _granteeWallet.getAddress(),
        );
        await _grantFromManager.withdrawPayout(
          await _granteeWallet.getAddress(),
        );
        const balanceAfterPayoutForGrantee = await _token.balanceOf(
          await _granteeWallet.getAddress(),
        );
        expect(balanceBeforePayoutForGrantee.add(REFUND_AMOUNT)).to.eq(
          balanceAfterPayoutForGrantee,
        );

        // second grantee
        const balanceBeforePayoutForSecondGrantee = await _token.balanceOf(
          await _secondGranteeWallet.getAddress(),
        );
        await _grantFromManager.approvePayout(
          REFUND_AMOUNT,
          await _secondGranteeWallet.getAddress(),
        );
        await _grantFromManager.withdrawPayout(
          await _secondGranteeWallet.getAddress(),
        );
        const balanceAfterPayoutForSecondGrantee = await _token.balanceOf(
          await _secondGranteeWallet.getAddress(),
        );
        expect(balanceBeforePayoutForSecondGrantee.add(REFUND_AMOUNT)).to.eq(
          balanceAfterPayoutForSecondGrantee,
        );

        // Checking Grant's token balance
        const balanceAfterPayoutForGrant = await _token.balanceOf(
          _grantFromManager.address,
        );
        expect(
          balanceBeforePayoutForGrant.sub(REFUND_AMOUNT).sub(REFUND_AMOUNT),
        ).to.eq(balanceAfterPayoutForGrant);
      });

      it('should update balance of donor and grant on withdraw refund a second time', async () => {
        const balanceBeforeRefundForGrant = await _token.balanceOf(
          _grantFromManager.address,
        );

        await _grantFromManager.approveRefund(REFUND_AMOUNT, AddressZero);

        // refunding by first donor and balance calculations
        const balanceBeforeRefundForDonor = await _token.balanceOf(
          await _donorWallet.getAddress(),
        );
        await _grantFromDonor.withdrawRefund(await _donorWallet.getAddress());
        const balanceAfterRefundForDonor = await _token.balanceOf(
          await _donorWallet.getAddress(),
        );
        expect(balanceBeforeRefundForDonor.add(REFUND_AMOUNT / 2)).to.eq(
          balanceAfterRefundForDonor,
        );

        const balanceAfterRefundForGrant = await _token.balanceOf(
          _grantFromManager.address,
        );

        expect(balanceBeforeRefundForGrant.sub(REFUND_AMOUNT / 2)).to.eq(
          balanceAfterRefundForGrant,
        );
      });
    });

    describe('Refunding - Approve & Withdraw', () => {
      describe('With Token - total funding by both donors at once', () => {
        let _token: Contract;
        let _grantFromDonor: Contract;
        let _grantFromSecondDonor: Contract;
        let _grantFromManager: Contract;
        let _donorWallet: Signer;
        let _secondDonorWallet: Signer;
        let lastRefundOfDonor: BigNumber;
        let lastRefundOfSecondDonor: BigNumber;
        let tokenBalanceOfDonor: BigNumber;
        let tokenBalanceOfSecondDonor: BigNumber;

        before(async () => {
          const {
            tokenFromDonor,
            tokenFromSecondDonor,
            grantFromDonorWithToken,
            grantFromSecondDonorWithToken,
            grantFromManagerWithToken,
            donorWallet,
            secondDonorWallet,
          } = await fixtureWithMultipleGrantee(bre);

          _grantFromDonor = grantFromDonorWithToken;
          _grantFromSecondDonor = grantFromSecondDonorWithToken;
          _donorWallet = donorWallet;
          _secondDonorWallet = secondDonorWallet;
          _grantFromManager = grantFromManagerWithToken;
          _token = tokenFromDonor;

          await tokenFromDonor.approve(grantFromDonorWithToken.address, 1e6);
          await tokenFromSecondDonor.approve(
            grantFromDonorWithToken.address,
            1e6,
          );

          await _grantFromDonor.fund(FUND_AMOUNT);
          await _grantFromSecondDonor.fund(FUND_AMOUNT);

          const {
            refunded: _lastRefundOfDonor,
          } = await _grantFromManager.donors(await _donorWallet.getAddress());
          const {
            refunded: _lastRefundOfSecondDonor,
          } = await _grantFromManager.donors(
            await _secondDonorWallet.getAddress(),
          );
          lastRefundOfDonor = _lastRefundOfDonor;
          lastRefundOfSecondDonor = _lastRefundOfSecondDonor;

          tokenBalanceOfDonor = await _token.balanceOf(
            await _donorWallet.getAddress(),
          );
          tokenBalanceOfSecondDonor = await _token.balanceOf(
            await _secondDonorWallet.getAddress(),
          );
        });
        it('should be refunded with initial amount', async () => {
          await _grantFromManager.approveRefund(REFUND_AMOUNT, AddressZero);

          await _grantFromManager.withdrawRefund(
            await _donorWallet.getAddress(),
          );
          await _grantFromManager.withdrawRefund(
            await _secondDonorWallet.getAddress(),
          );

          // Checking current refund balance
          const {
            refunded: _lastRefundOfDonor,
          } = await _grantFromManager.donors(await _donorWallet.getAddress());
          const {
            refunded: _lastRefundOfSecondDonor,
          } = await _grantFromManager.donors(
            await _secondDonorWallet.getAddress(),
          );

          expect(lastRefundOfDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfDonor,
          );
          expect(lastRefundOfSecondDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfSecondDonor,
          );

          // Checking current token balance
          const _tokenBalanceOfDonor = await _token.balanceOf(
            await _donorWallet.getAddress(),
          );
          const _tokenBalanceOfSecondDonor = await _token.balanceOf(
            await _secondDonorWallet.getAddress(),
          );

          expect(tokenBalanceOfDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _tokenBalanceOfDonor,
          );
          expect(tokenBalanceOfSecondDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _tokenBalanceOfSecondDonor,
          );

          // Initializing token and refund balances for next test case.
          tokenBalanceOfDonor = _tokenBalanceOfDonor;
          tokenBalanceOfSecondDonor = _tokenBalanceOfSecondDonor;

          lastRefundOfDonor = _lastRefundOfDonor;
          lastRefundOfSecondDonor = _lastRefundOfSecondDonor;
        });

        it('should be refunded with partial amount', async () => {
          await _grantFromManager.approveRefund(REFUND_AMOUNT, AddressZero);

          await _grantFromManager.withdrawRefund(
            await _donorWallet.getAddress(),
          );
          await _grantFromManager.withdrawRefund(
            await _secondDonorWallet.getAddress(),
          );

          // Checking current refund balance
          const {
            refunded: _lastRefundOfDonor,
          } = await _grantFromManager.donors(await _donorWallet.getAddress());
          const {
            refunded: _lastRefundOfSecondDonor,
          } = await _grantFromManager.donors(
            await _secondDonorWallet.getAddress(),
          );

          expect(lastRefundOfDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfDonor,
          );
          expect(lastRefundOfSecondDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfSecondDonor,
          );

          // Checking current token balance
          const _tokenBalanceOfDonor = await _token.balanceOf(
            await _donorWallet.getAddress(),
          );
          const _tokenBalanceOfSecondDonor = await _token.balanceOf(
            await _secondDonorWallet.getAddress(),
          );

          expect(tokenBalanceOfDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _tokenBalanceOfDonor,
          );
          expect(tokenBalanceOfSecondDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _tokenBalanceOfSecondDonor,
          );

          // Initializing token and refund balances for next test case.
          tokenBalanceOfDonor = _tokenBalanceOfDonor;
          tokenBalanceOfSecondDonor = _tokenBalanceOfSecondDonor;

          lastRefundOfDonor = _lastRefundOfDonor;
          lastRefundOfSecondDonor = _lastRefundOfSecondDonor;
        });

        it('should be refunded with final amount', async () => {
          await _grantFromManager.approveRefund(REFUND_AMOUNT, AddressZero);

          await _grantFromManager.withdrawRefund(
            await _donorWallet.getAddress(),
          );
          await _grantFromManager.withdrawRefund(
            await _secondDonorWallet.getAddress(),
          );

          // Checking current refund balance.
          const {
            refunded: _lastRefundOfDonor,
          } = await _grantFromManager.donors(await _donorWallet.getAddress());
          const {
            refunded: _lastRefundOfSecondDonor,
          } = await _grantFromManager.donors(
            await _secondDonorWallet.getAddress(),
          );

          expect(lastRefundOfDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfDonor,
          );
          expect(lastRefundOfSecondDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfSecondDonor,
          );

          // Checking current token balance check
          const _tokenBalanceOfDonor = await _token.balanceOf(
            await _donorWallet.getAddress(),
          );
          const _tokenBalanceOfSecondDonor = await _token.balanceOf(
            await _secondDonorWallet.getAddress(),
          );

          expect(tokenBalanceOfDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _tokenBalanceOfDonor,
          );
          expect(tokenBalanceOfSecondDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _tokenBalanceOfSecondDonor,
          );

          // Initializing token and refund balances for next test case.
          tokenBalanceOfDonor = _tokenBalanceOfDonor;
          tokenBalanceOfSecondDonor = _tokenBalanceOfSecondDonor;

          lastRefundOfDonor = _lastRefundOfDonor;
          lastRefundOfSecondDonor = _lastRefundOfSecondDonor;
        });
      });

      describe('With Ether - total funding by both donors at once', () => {
        let _grantFromDonorWithEther: Contract;
        let _grantFromSecondDonorWithEther: Contract;
        let _grantFromManagerWithEther: Contract;
        let _donorWallet: Signer;
        let _secondDonorWallet: Signer;
        let lastRefundOfDonor: BigNumber;
        let lastRefundOfSecondDonor: BigNumber;
        let etherBalanceOfDonor: BigNumber;
        let etherBalanceOfSecondDonor: BigNumber;
        let _provider: any;

        before(async () => {
          const {
            donorWallet,
            secondDonorWallet,
            grantFromDonorWithEther,
            grantFromSecondDonorWithEther,
            grantFromManagerWithEther,
            provider,
          } = await fixtureWithMultipleGrantee(bre);

          _donorWallet = donorWallet;
          _secondDonorWallet = secondDonorWallet;
          _grantFromDonorWithEther = grantFromDonorWithEther;
          _grantFromSecondDonorWithEther = grantFromSecondDonorWithEther;
          _grantFromManagerWithEther = grantFromManagerWithEther;
          _provider = provider;

          // Initial Ether Funding
          await _donorWallet.sendTransaction({
            to: grantFromDonorWithEther.address,
            value: FUND_AMOUNT,
            gasPrice: 1,
          });
          await _secondDonorWallet.sendTransaction({
            to: grantFromDonorWithEther.address,
            value: FUND_AMOUNT,
            gasPrice: 1,
          });

          const {
            refunded: _lastRefundOfDonor,
          } = await _grantFromManagerWithEther.donors(
            await _donorWallet.getAddress(),
          );
          const {
            refunded: _lastRefundOfSecondDonor,
          } = await _grantFromManagerWithEther.donors(
            await _secondDonorWallet.getAddress(),
          );

          lastRefundOfDonor = _lastRefundOfDonor;
          lastRefundOfSecondDonor = _lastRefundOfSecondDonor;

          etherBalanceOfDonor = await _provider.getBalance(
            await _donorWallet.getAddress(),
          );
          etherBalanceOfSecondDonor = await _provider.getBalance(
            await _secondDonorWallet.getAddress(),
          );
        });

        it('should be refunded with initial amount', async () => {
          await _grantFromManagerWithEther.approveRefund(
            REFUND_AMOUNT,
            AddressZero,
          );

          const receiptForDonor = await (
            await _grantFromDonorWithEther.withdrawRefund(
              await _donorWallet.getAddress(),
              { gasPrice: 1 },
            )
          ).wait();
          const receiptForSecondDonor = await (
            await _grantFromSecondDonorWithEther.withdrawRefund(
              await _secondDonorWallet.getAddress(),
              { gasPrice: 1 },
            )
          ).wait();

          // Checking current refund balance
          const {
            refunded: _lastRefundOfDonor,
          } = await _grantFromManagerWithEther.donors(
            await _donorWallet.getAddress(),
          );
          const {
            refunded: _lastRefundOfSecondDonor,
          } = await _grantFromManagerWithEther.donors(
            await _secondDonorWallet.getAddress(),
          );

          expect(lastRefundOfDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfDonor,
          );
          expect(lastRefundOfSecondDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfSecondDonor,
          );

          // Checking current ether balance
          const _etherBalanceOfDonor = await _provider.getBalance(
            await _donorWallet.getAddress(),
          );
          const _etherBalanceOfSecondDonor = await _provider.getBalance(
            await _secondDonorWallet.getAddress(),
          );

          expect(
            etherBalanceOfDonor
              .add(REFUND_AMOUNT / 2)
              .sub(receiptForDonor.gasUsed),
          ).to.be.eq(_etherBalanceOfDonor);
          expect(
            etherBalanceOfSecondDonor
              .add(REFUND_AMOUNT / 2)
              .sub(receiptForSecondDonor.gasUsed),
          ).to.be.eq(_etherBalanceOfSecondDonor);

          // Initializing ether and refund balances for next test case.
          etherBalanceOfDonor = _etherBalanceOfDonor;
          etherBalanceOfSecondDonor = _etherBalanceOfSecondDonor;

          lastRefundOfDonor = _lastRefundOfDonor;
          lastRefundOfSecondDonor = _lastRefundOfSecondDonor;
        });

        it('should be refunded with partial amount', async () => {
          await _grantFromManagerWithEther.approveRefund(
            REFUND_AMOUNT,
            AddressZero,
          );

          const receiptForDonor = await (
            await _grantFromDonorWithEther.withdrawRefund(
              await _donorWallet.getAddress(),
              { gasPrice: 1 },
            )
          ).wait();
          const receiptForSecondDonor = await (
            await _grantFromSecondDonorWithEther.withdrawRefund(
              await _secondDonorWallet.getAddress(),
              { gasPrice: 1 },
            )
          ).wait();

          // Checking current refund balance
          const {
            refunded: _lastRefundOfDonor,
          } = await _grantFromManagerWithEther.donors(
            await _donorWallet.getAddress(),
          );
          const {
            refunded: _lastRefundOfSecondDonor,
          } = await _grantFromManagerWithEther.donors(
            await _secondDonorWallet.getAddress(),
          );

          expect(lastRefundOfDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfDonor,
          );
          expect(lastRefundOfSecondDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfSecondDonor,
          );

          // Checking current ether balance
          const _etherBalanceOfDonor = await _provider.getBalance(
            await _donorWallet.getAddress(),
          );
          const _etherBalanceOfSecondDonor = await _provider.getBalance(
            await _secondDonorWallet.getAddress(),
          );

          expect(
            etherBalanceOfDonor
              .add(REFUND_AMOUNT / 2)
              .sub(receiptForDonor.gasUsed),
          ).to.be.eq(_etherBalanceOfDonor);
          expect(
            etherBalanceOfSecondDonor
              .add(REFUND_AMOUNT / 2)
              .sub(receiptForSecondDonor.gasUsed),
          ).to.be.eq(_etherBalanceOfSecondDonor);

          // Initializing ether and refund balances for next test case.
          etherBalanceOfDonor = _etherBalanceOfDonor;
          etherBalanceOfSecondDonor = _etherBalanceOfSecondDonor;

          lastRefundOfDonor = _lastRefundOfDonor;
          lastRefundOfSecondDonor = _lastRefundOfSecondDonor;
        });

        it('should be refunded with final amount', async () => {
          await _grantFromManagerWithEther.approveRefund(
            REFUND_AMOUNT,
            AddressZero,
          );

          const receiptForDonor = await (
            await _grantFromDonorWithEther.withdrawRefund(
              await _donorWallet.getAddress(),
              { gasPrice: 1 },
            )
          ).wait();
          const receiptForSecondDonor = await (
            await _grantFromSecondDonorWithEther.withdrawRefund(
              await _secondDonorWallet.getAddress(),
              { gasPrice: 1 },
            )
          ).wait();

          // Checking current refund balance
          const {
            refunded: _lastRefundOfDonor,
          } = await _grantFromManagerWithEther.donors(
            await _donorWallet.getAddress(),
          );
          const {
            refunded: _lastRefundOfSecondDonor,
          } = await _grantFromManagerWithEther.donors(
            await _secondDonorWallet.getAddress(),
          );

          expect(lastRefundOfDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfDonor,
          );
          expect(lastRefundOfSecondDonor.add(REFUND_AMOUNT / 2)).to.be.eq(
            _lastRefundOfSecondDonor,
          );

          // Checking current ether balance
          const _etherBalanceOfDonor = await _provider.getBalance(
            await _donorWallet.getAddress(),
          );
          const _etherBalanceOfSecondDonor = await _provider.getBalance(
            await _secondDonorWallet.getAddress(),
          );

          expect(
            etherBalanceOfDonor
              .add(REFUND_AMOUNT / 2)
              .sub(receiptForDonor.gasUsed),
          ).to.be.eq(_etherBalanceOfDonor);
          expect(
            etherBalanceOfSecondDonor
              .add(REFUND_AMOUNT / 2)
              .sub(receiptForSecondDonor.gasUsed),
          ).to.be.eq(_etherBalanceOfSecondDonor);

          // Initializing ether and refund balances for next test case.
          etherBalanceOfDonor = _etherBalanceOfDonor;
          etherBalanceOfSecondDonor = _etherBalanceOfSecondDonor;

          lastRefundOfDonor = _lastRefundOfDonor;
          lastRefundOfSecondDonor = _lastRefundOfSecondDonor;
        });
      });
    });
  });
});
