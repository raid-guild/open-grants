import { Bytes, Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ManagedCappedGrant,
  LogFundingComplete,
  LogGrantCancellation,
  LogFunding,
  LogRefund,
  LogPayment,
  LogPaymentApproval,
  LogRefundApproval
} from "../generated/ManagedCappedGrant/ManagedCappedGrant"

import { LogNewGrant } from "../generated/GrantFactory/GrantFactory"
import { returnGrantsInfo } from "./getters"
import { Fund, Payment, Contract } from "../generated/schema"

export function handleLogNewGrant(event: LogNewGrant): void {
  let id = event.params.grant.toHexString()

  let returnedGrant = returnGrantsInfo(event.params.grant);

  let contract = new Contract(id);
  contract.contractAddress = event.address
  contract.grantId = event.params.id
  contract.grantAddress = event.params.grant

  contract.uri = returnedGrant.uri;
  contract.manager = returnedGrant.manager;
  contract.currency = returnedGrant.currency;
  contract.targetFunding = returnedGrant.targetFunding;
  contract.totalFunding = returnedGrant.totalFunding;
  contract.totalPayed = returnedGrant.totalPayed;
  contract.availableBalance = returnedGrant.availableBalance;
  contract.canFund = returnedGrant.canFund;
  contract.grantCancelled = returnedGrant.grantCancelled;
  contract.fundingExpiration = returnedGrant.fundingDeadline;
  contract.contractExpiration = returnedGrant.contractExpiration;

  contract.save();
}

export function handleLogFundingComplete(event: LogFundingComplete): void { }

export function handleLogGrantCancellation(event: LogGrantCancellation): void {
  let contract = Contract.load(event.address.toHexString());

  contract.grantCancelled = false;
  contract.canFund = false;
}

export function handleLogFunding(event: LogFunding): void {
  let fund = new Fund(event.transaction.hash.toHex());
  fund.grantAddress = event.address
  fund.donor = event.params.donor
  fund.amount = event.params.value
  fund.save()

  let contract = Contract.load(event.address.toHexString());

  if (contract != null) {
    let returnedGrant = returnGrantsInfo(event.address);

    contract.totalFunding = returnedGrant.totalFunding;
    contract.availableBalance = returnedGrant.availableBalance;
    contract.canFund = returnedGrant.canFund;

    contract.save();

  }

}

export function handleLogRefund(event: LogRefund): void { }

export function handleLogPayment(event: LogPayment): void {
  let payment = new Payment(event.transaction.hash.toHex());
  payment.grantee = event.params.grantee
  payment.grantAddress = event.address
  payment.amount = event.params.value
  payment.save();


  let contract = Contract.load(event.address.toHexString());

  if (contract != null) {
    let returnedGrant = returnGrantsInfo(event.address);

    contract.totalPayed = returnedGrant.totalPayed;
    contract.availableBalance = returnedGrant.availableBalance;

    contract.save();
  }

}

export function handleLogPaymentApproval(event: LogPaymentApproval): void { }

export function handleLogRefundApproval(event: LogRefundApproval): void { }
