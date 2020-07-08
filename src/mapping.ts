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
import { ethers } from 'ethers';

// import * as moment from 'moment';

export function handleLogNewGrant(event: LogNewGrant): void {
  let id = event.params.grant.toHexString()


  let contract = new Contract(id);
  contract.contractAddress = event.address
  contract.grantId = event.params.id
  contract.grantAddress = event.params.grant

  const ABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "name": "id", "type": "uint256" }, { "indexed": false, "name": "grant", "type": "address" }], "name": "LogNewGrant", "type": "event" }, { "constant": false, "inputs": [{ "name": "_grantees", "type": "address[]" }, { "name": "_amounts", "type": "uint256[]" }, { "name": "_manager", "type": "address" }, { "name": "_currency", "type": "address" }, { "name": "_targetFunding", "type": "uint256" }, { "name": "_fundingExpiration", "type": "uint256" }, { "name": "_contractExpiration", "type": "uint256" }, { "name": "_extraData", "type": "bytes" }], "name": "create", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
  const iface = new ethers.utils.Interface(ABI);
  const input = iface.parseTransaction({ data: event.transaction.input })

  contract.createBy = event.transaction.from;;
  contract.grantees = input.args[0];
  contract.amounts = input.args[1].map((amount) => {
    return ethers.utils.formatEther(amount);
  });
  contract.manager = input.args[2];
  contract.currency = input.args[3];
  contract.fundingDeadline = input.args[5].toString(16).toUpperCase();
  contract.contractExpiration = input.args[6].toString(16).toUpperCase();
  contract.uri = input.args[7]

  let returnedGrant = returnGrantsInfo(event.params.grant);

  contract.targetFunding = returnedGrant.targetFunding;
  contract.totalFunding = returnedGrant.totalFunding;
  contract.totalPayed = returnedGrant.totalPayed;
  contract.availableBalance = returnedGrant.availableBalance;
  contract.canFund = returnedGrant.canFund;
  contract.grantCancelled = returnedGrant.grantCancelled;

  contract.save();
}

export function handleLogFundingComplete(event: LogFundingComplete): void { }

export function handleLogGrantCancellation(event: LogGrantCancellation): void {
  let contract = Contract.load(event.address.toHexString());

  if (contract != null) {
    let returnedGrant = returnGrantsInfo(event.address);

    contract.grantCancelled = returnedGrant.grantCancelled;
    contract.canFund = returnedGrant.canFund;

    contract.save();
  }
}

export function handleLogFunding(event: LogFunding): void {
  let fund = new Fund(event.transaction.hash.toHex());
  fund.grantAddress = event.address
  fund.donor = event.params.donor
  fund.amount = event.params.value
  fund.save()

  // let contract = Contract.load(event.address.toHexString());

  // if (contract != null) {
  //   let returnedGrant = returnGrantsInfo(event.address);

  //   contract.totalFunding = returnedGrant.totalFunding;
  //   contract.availableBalance = returnedGrant.availableBalance;
  //   contract.canFund = returnedGrant.canFund;

  //   if (!contract.donors.find((donor) => donor == event.params.donor)) {
  //     contract.donors.push(event.params.donor);
  //   }

  // contract.save();
  // }

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
