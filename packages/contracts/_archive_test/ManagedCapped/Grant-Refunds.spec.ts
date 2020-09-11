import chai from 'chai';
import * as waffle from 'ethereum-waffle';
import { Contract, Wallet, constants, Signer } from 'ethers';
import { BigNumber } from 'ethers/utils/bignumber';
import { Web3Provider, Provider } from 'ethers/providers';
import { bigNumberify, randomBytes, solidityKeccak256, id } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import { helpers } from '../helpers/helpers';
import bre from '@nomiclabs/buidler';

const fixture = helpers.fixtures.fixture;
const TARGET_FUNDING = helpers.constants.TARGET_FUNDING;

chai.use(waffle.solidity);
const { expect, assert } = chai;

describe('Grant-Refunds', () => {
  describe('With Token', () => {
    describe('Refunding', () => {
      let _grantFromDonorWithToken: Contract;
      const _fundAmount = 500;
      let _grantFromManagerWithToken: Contract;
      let _donorWallet: Signer;
      let _unknownWallet: Signer;

      before(async () => {
        const {
          tokenFromDonor,
          grantFromDonorWithToken,
          grantFromManagerWithToken,
          donorWallet,
          unknownWallet,
        } = await fixture(bre);

        _grantFromDonorWithToken = grantFromDonorWithToken;
        _grantFromManagerWithToken = grantFromManagerWithToken;
        _donorWallet = donorWallet;
        _unknownWallet = unknownWallet;

        await tokenFromDonor.approve(grantFromDonorWithToken.address, 1000);

        await _grantFromDonorWithToken.fund(_fundAmount);

        await _grantFromManagerWithToken.approveRefund(
          _fundAmount,
          AddressZero,
        );
      });

      it('should update Total Refund', async () => {
        const totalRefunded = await _grantFromDonorWithToken.totalRefunded();
        expect(totalRefunded).to.eq(_fundAmount);
      });

      it('should emit a LogRefund event', async () => {
        await expect(
          _grantFromDonorWithToken.withdrawRefund(
            await _donorWallet.getAddress(),
          ),
        )
          .to.emit(_grantFromDonorWithToken, 'LogRefund')
          .withArgs(await _donorWallet.getAddress(), _fundAmount);
      });

      it('should emit LogRefund event', async () => {
        await expect(
          _grantFromDonorWithToken.withdrawRefund(
            await _donorWallet.getAddress(),
          ),
        )
          .to.emit(_grantFromDonorWithToken, 'LogRefund')
          .withArgs(await _donorWallet.getAddress(), 0);
      });

      it('should send 0 token if address does not belong to donor', async () => {
        await expect(
          _grantFromDonorWithToken.withdrawRefund(
            await _unknownWallet.getAddress(),
          ),
        )
          .to.emit(_grantFromDonorWithToken, 'LogRefund')
          .withArgs(await _unknownWallet.getAddress(), 0);
      });

      it('should update total refunded of Grant', async () => {
        const totalRefunded = await _grantFromManagerWithToken.totalRefunded();
        expect(totalRefunded).to.eq(_fundAmount);
      });
    });

    describe('Approve refunding', () => {
      let _grantFromDonorWithToken: Contract;
      const _fundAmount = 500;
      let _grantFromManagerWithToken: Contract;
      let _granteeWallet: Signer;

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

        await tokenFromDonor.approve(grantFromDonorWithToken.address, 1000);
        await _grantFromDonorWithToken.fund(_fundAmount);
      });

      it('should revert if called by non manager', async () => {
        await expect(
          _grantFromDonorWithToken.approveRefund(_fundAmount, AddressZero),
        ).to.be.revertedWith(
          'onlyManager::Permission Error. Function can only be called by manager.',
        );
      });

      it('should revert if amount > availableBalance', async () => {
        await expect(
          _grantFromManagerWithToken.approveRefund(
            _fundAmount + 1,
            AddressZero,
          ),
        ).to.be.revertedWith(
          'approveRefund::Invalid Argument. Amount is greater than Available Balance.',
        );
      });

      it('should revert if amount > remaining allocation of grantee', async () => {
        const {
          targetFunding,
          totalPaid,
          payoutApproved,
        } = await _grantFromManagerWithToken.grantees(
          await _granteeWallet.getAddress(),
        );

        const amount = targetFunding.sub(totalPaid).sub(payoutApproved);

        await expect(
          _grantFromManagerWithToken.approveRefund(
            amount + 1,
            await _granteeWallet.getAddress(),
          ),
        ).to.be.revertedWith(
          'approveRefund::Invalid Argument. Value greater than remaining allocation.',
        );
      });
    });

    describe('When approve refunding not done by manager', () => {
      let _grantFromDonorWithToken: Contract;
      const _fundAmount = 500;
      let _grantFromManagerWithToken: Contract;
      let _donorWallet: Signer;

      before(async () => {
        const {
          tokenFromDonor,
          grantFromDonorWithToken,
          grantFromManagerWithToken,
          donorWallet,
        } = await fixture(bre);

        _grantFromDonorWithToken = grantFromDonorWithToken;
        _grantFromManagerWithToken = grantFromManagerWithToken;
        _donorWallet = donorWallet;

        await tokenFromDonor.approve(grantFromDonorWithToken.address, 1000);

        await _grantFromDonorWithToken.fund(_fundAmount);
      });

      it('then total refunded should be zero', async () => {
        const totalRefunded = await _grantFromManagerWithToken.totalRefunded();
        expect(totalRefunded).to.eq(0);
      });

      it('then refund to donor should be zero', async () => {
        await expect(
          _grantFromDonorWithToken.withdrawRefund(
            await _donorWallet.getAddress(),
          ),
        )
          .to.emit(_grantFromDonorWithToken, 'LogRefund')
          .withArgs(await _donorWallet.getAddress(), 0);

        const { refunded } = await _grantFromManagerWithToken.donors(
          await _donorWallet.getAddress(),
        );
        expect(refunded).to.eq(0);
      });
    });

    describe('Approve Refund when passing Grantee address as argument', () => {
      let _grantFromDonorWithToken: Contract;
      const FUNDING_AMOUNT = 1e3;
      const REFUND_AMOUNT = FUNDING_AMOUNT / 2;
      let _grantFromManagerWithToken: Contract;
      let _granteeWallet: Signer;

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

        await tokenFromDonor.approve(grantFromDonorWithToken.address, 1e3);
        await _grantFromDonorWithToken.fund(FUNDING_AMOUNT);
      });

      it('should not reduce target funding for grantee', async () => {
        const {
          targetFunding: targetFundingBeforeApproveFund,
        } = await _grantFromManagerWithToken.grantees(
          await _granteeWallet.getAddress(),
        );

        //  const targetFundingBeforeApproveFund = targetFunding;

        await _grantFromManagerWithToken.approveRefund(
          REFUND_AMOUNT,
          AddressZero,
        );

        const {
          targetFunding: targetFundingAfterApproveFund,
        } = await _grantFromManagerWithToken.grantees(
          await _granteeWallet.getAddress(),
        );

        //  const targetFundingAfterApproveFund = targetFunding;

        expect(targetFundingBeforeApproveFund).to.eq(
          targetFundingAfterApproveFund,
        );
      });

      it('should reduce target funding for grantee by refund amount', async () => {
        const {
          targetFunding: targetFundingBeforeApproveFund,
        } = await _grantFromManagerWithToken.grantees(
          await _granteeWallet.getAddress(),
        );

        //  const targetFundingBeforeApproveFund = targetFunding;

        await _grantFromManagerWithToken.approveRefund(
          REFUND_AMOUNT,
          await _granteeWallet.getAddress(),
        );

        const {
          targetFunding: targetFundingAfterApproveFund,
        } = await _grantFromManagerWithToken.grantees(
          await _granteeWallet.getAddress(),
        );

        // const targetFundingAfterApproveFund = targetFunding;

        expect(targetFundingBeforeApproveFund).to.eq(
          targetFundingAfterApproveFund.add(REFUND_AMOUNT),
        );
      });
    });

    describe("Donor's balance", () => {
      let _grantFromDonorWithToken: Contract;
      const FUNDING_AMOUNT = 1e3;
      const REFUND_AMOUNT = FUNDING_AMOUNT / 2;
      let _grantFromManagerWithToken: Contract;
      let _donorWallet: Signer;
      let _tokenFromDonor: Contract;
      let initialBalanceAfterFunding: any;

      before(async () => {
        const {
          tokenFromDonor,
          grantFromDonorWithToken,
          grantFromManagerWithToken,
          donorWallet,
        } = await fixture(bre);

        _grantFromDonorWithToken = grantFromDonorWithToken;
        _grantFromManagerWithToken = grantFromManagerWithToken;
        _donorWallet = donorWallet;
        _tokenFromDonor = tokenFromDonor;

        // Token Funding by Donor
        await tokenFromDonor.approve(grantFromDonorWithToken.address, 1e3);
        await _grantFromDonorWithToken.fund(FUNDING_AMOUNT);

        initialBalanceAfterFunding = await tokenFromDonor.balanceOf(
          await _donorWallet.getAddress(),
        );
      });

      it('should not be updated yet', async () => {
        // Checking donor's token balance
        const tokenBalance = await _tokenFromDonor.balanceOf(
          await _donorWallet.getAddress(),
        );
        expect(initialBalanceAfterFunding).to.eq(tokenBalance);

        // Checking donor's refunded field
        const { refunded } = await _grantFromManagerWithToken.donors(
          await _donorWallet.getAddress(),
        );
        expect(refunded).to.eq(0);
      });

      it('should updated with token after approve refund and withdraw refund', async () => {
        await _grantFromManagerWithToken.approveRefund(
          REFUND_AMOUNT,
          AddressZero,
        );
        await _grantFromDonorWithToken.withdrawRefund(
          await _donorWallet.getAddress(),
        );

        // Checking donor's token balance
        const finalBalanceAfterRefunding = await _tokenFromDonor.balanceOf(
          await _donorWallet.getAddress(),
        );
        expect(initialBalanceAfterFunding.add(REFUND_AMOUNT)).to.eq(
          finalBalanceAfterRefunding,
        );

        // Checking donor's refunded field
        const { refunded } = await _grantFromManagerWithToken.donors(
          await _donorWallet.getAddress(),
        );
        expect(refunded).to.eq(REFUND_AMOUNT);
      });
    });
  });

  describe('With Ether', () => {
    describe("Donor's balance", () => {
      let _grantFromDonorWithEther: Contract;
      const FUNDING_AMOUNT = 1e3;
      const REFUND_AMOUNT = FUNDING_AMOUNT / 2;
      let _grantFromManagerWithEther: Contract;
      let _donorWallet: Signer;
      let _provider: any;
      let _initialEtherBalance: BigNumber;

      before(async () => {
        const {
          grantFromDonorWithEther,
          grantFromManagerWithEther,
          donorWallet,
          provider,
        } = await fixture(bre);

        _grantFromDonorWithEther = grantFromDonorWithEther;
        _grantFromManagerWithEther = grantFromManagerWithEther;
        _donorWallet = donorWallet;
        _provider = provider;

        // Ether funding by Donor
        await donorWallet.sendTransaction({
          to: _grantFromDonorWithEther.address,
          value: 1e6,
          gasPrice: 1,
        });

        _initialEtherBalance = await _provider.getBalance(
          await _donorWallet.getAddress(),
        );
      });

      it('should not be updated yet', async () => {
        // Checking donor's ether balance
        const etherBalance = await _provider.getBalance(
          await _donorWallet.getAddress(),
        );
        expect(_initialEtherBalance).to.be.eq(etherBalance);

        // Checking donor's refunded field
        const { refunded } = await _grantFromManagerWithEther.donors(
          await _donorWallet.getAddress(),
        );
        expect(refunded).to.be.eq(0);
      });

      it('should updated with ether after approve refund and withdraw refund', async () => {
        // Approve and withdraw Fund for Donor.
        await _grantFromManagerWithEther.approveRefund(
          REFUND_AMOUNT,
          AddressZero,
        );
        const receipt = await (
          await _grantFromDonorWithEther.withdrawRefund(
            await _donorWallet.getAddress(),
            { gasPrice: 1 },
          )
        ).wait();

        // Checking donor's refunded field
        const { refunded } = await _grantFromManagerWithEther.donors(
          await _donorWallet.getAddress(),
        );
        expect(refunded).to.be.eq(REFUND_AMOUNT);

        // Checking donor's ether balance
        const etherBalanceAfterRefunding = await _provider.getBalance(
          await _donorWallet.getAddress(),
        );
        expect(
          _initialEtherBalance.sub(receipt.gasUsed).add(REFUND_AMOUNT),
        ).to.be.eq(etherBalanceAfterRefunding);
      });
    });
  });
});
