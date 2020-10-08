import { Bytes, log } from '@graphprotocol/graph-ts';

import { Fund, Grant, Payment, Stream } from '../generated/schema';
import {
  LogFunding,
  LogPayment,
} from '../generated/UnmanagedStream/UnmanagedStream';
import { LogNewGrant } from '../generated/UnmanagedStreamFactory/UnmanagedStreamFactory';
import { fetchGrantInfo } from './helpers';

export function handleLogNewGrant(event: LogNewGrant): void {
  let grant = new Grant(event.params.grant.toHexString());
  grant.factoryAddress = event.address;
  grant.createdBy = event.transaction.from;
  grant.timestamp = event.block.timestamp;
  grant.grantId = event.params.id;
  grant.grantAddress = event.params.grant;
  grant.grantees = event.params.grantees as Array<Bytes>;
  grant.amounts = event.params.amounts;

  let fetchedGrant = fetchGrantInfo(event.params.grant);
  grant.funded = fetchedGrant.totalFunded;
  grant.uri = fetchedGrant.uri;
  grant.name = fetchedGrant.name;
  grant.description = fetchedGrant.description;
  grant.link = fetchedGrant.link;
  grant.contactLink = fetchedGrant.contactLink;

  grant.donors = new Array<Bytes>();
  grant.funds = new Array<string>();
  grant.payments = new Array<string>();
  grant.streams = new Array<string>();

  grant.save();
  log.debug('New Grant {}', [grant.id]);
}

export function handleLogFunding(event: LogFunding): void {
  let fund = new Fund(event.transaction.hash.toHexString());
  fund.grantAddress = event.address;
  fund.timestamp = event.block.timestamp;
  fund.donor = event.params.donor;
  fund.amount = event.params.value;
  let stream = Stream.load(event.address.toHexString());
  if (stream != null) {
    fund.stream = stream.id;
    fund.donor = stream.owner;
  }
  fund.save();

  let grant = Grant.load(event.address.toHexString());
  if (grant != null) {
    log.debug('New Funding {} for Grant {}', [fund.id, grant.id]);
    let fetchedGrant = fetchGrantInfo(event.address);
    grant.funded = fetchedGrant.totalFunded;

    let donors = grant.donors;
    if (donors.indexOf(fund.donor) == -1) {
      donors.push(fund.donor);
    }
    grant.donors = donors;

    let funds = grant.funds;
    funds.push(fund.id);
    grant.funds = funds;

    grant.save();
  } else {
    log.debug('Grant {} not found for Funding {}', [
      event.address.toHexString(),
      fund.id,
    ]);
  }
}

export function handleLogPayment(event: LogPayment): void {
  let payment = new Payment(event.logIndex.toHexString());
  payment.grantee = event.params.grantee;
  payment.grantAddress = event.address;
  payment.timestamp = event.block.timestamp;
  payment.amount = event.params.value;
  payment.save();

  let grant = Grant.load(event.address.toHexString());
  if (grant != null) {
    log.debug('New Payment {} for Grant {}', [payment.id, grant.id]);
    let payments = grant.payments;
    payments.push(payment.id);
    grant.payments = payments;
    grant.save();
  } else {
    log.debug('Grant {} not found for Payment {}', [
      event.address.toHexString(),
      payment.id,
    ]);
  }
}
