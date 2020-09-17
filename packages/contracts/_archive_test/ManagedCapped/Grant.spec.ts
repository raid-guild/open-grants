import chai from 'chai';
import * as waffle from 'ethereum-waffle';
import { Contract, Wallet, constants } from 'ethers';
import { BigNumber } from 'ethers/utils/bignumber';
import { Web3Provider, Provider } from 'ethers/providers';
import { bigNumberify, randomBytes, solidityKeccak256, id } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';

chai.use(waffle.solidity);
const { expect } = chai;

describe('Pending Tests', () => {
  describe('Payouts', () => {
    it('should revert if GrantStatus not SUCCESS');
    it(
      'should revert if called by non manager and not a Grantee matching grantee arg',
    );
    describe('approvePayout', () => {
      it('should revert if approved for more than remaining allocation');
      it('should log payment approval event');
      it('should update amount approved');
    });

    describe('withdrawPayout', () => {
      it('should revert if sender does not match grantee');
      it('should revert if value does not match payoutApproved');
      it('should update total payed');
      it('should update payoutApproved');
      it('should update contract balance');
      it('should send payment');
      it('should emit payment event');
    });
  });

  describe('Refunds', () => {
    it(
      'should revert if called by non manager and not a Donor matching donor arg',
    );
    it(
      'should handle correct dilution for payout -> refund -> payout -> refund -> refund',
    );
    describe('approveRefund', () => {
      it('should revert if donor already refunded');
      it('should should update refundApproved');
    });
    describe('withdrawRefund', () => {
      it('should revert if sender does not match donor argument');
      it('should update totalRefunded');
      it('should emit a LogRefund event');

      describe('when manager initiated', () => {
        it('should revert if not approved for refund');
      });

      describe('when donor initiated', () => {
        it('should set status to DONE');
        it('should set refundCheckpoint');
      });

      describe('when currency is Ether', () => {
        it('should update contract balance');
        it('should update donor balance');
      });
      describe('when currency is Token', () => {
        it('should update contract balance');
        it('should update donor balance');
      });
    });
  });
});
