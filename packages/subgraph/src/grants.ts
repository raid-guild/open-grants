import { Bytes, log } from '@graphprotocol/graph-ts';

import { Fund, Grant, Payment } from '../generated/schema';
import {
  LogFunding,
  LogPayment,
} from '../generated/UnmanagedStream/UnmanagedStream';
import { LogNewGrant } from '../generated/UnmanagedStreamFactory/UnmanagedStreamFactory';
import { fetchGrantInfo } from './helpers';

export function handleLogNewGrant(event: LogNewGrant): void {
  let grant = new Grant(event.params.grant.toHexString());
  grant.factoryAddress = event.address;
  grant.createBy = event.transaction.from;
  grant.grantId = event.params.id;
  grant.grantAddress = event.params.grant;
  grant.grantees = event.params.grantees as Array<Bytes>;
  grant.amounts = event.params.amounts;

  let fetchedGrant = fetchGrantInfo(event.params.grant);
  grant.totalFunded = fetchedGrant.totalFunded;
  grant.uri = fetchedGrant.uri;

  grant.funds = new Array<string>();
  grant.payments = new Array<string>();

  grant.save();
  log.info('New Grant {}', [grant.id]);
}

export function handleLogFunding(event: LogFunding): void {
  let fund = new Fund(event.transaction.hash.toHexString());
  fund.grantAddress = event.address;
  fund.donor = event.params.donor;
  fund.amount = event.params.value;
  fund.save();
  log.info('New Funding {}', [fund.id]);

  let grant = Grant.load(event.address.toHexString());
  if (grant != null) {
    log.debug('Updating Grant {} for funding {}', [grant.id, fund.id]);
    let fetchedGrant = fetchGrantInfo(event.address);
    grant.totalFunded = fetchedGrant.totalFunded;
    let funds = grant.funds;
    funds.push(fund.id);
    grant.funds = funds;
    grant.save();
  } else {
    log.debug('Grant {} not found for funding {}', [
      event.address.toHexString(),
      fund.id,
    ]);
  }
}

export function handleLogPayment(event: LogPayment): void {
  let payment = new Payment(event.logIndex.toHexString());
  payment.grantee = event.params.grantee;
  payment.grantAddress = event.address;
  payment.amount = event.params.value;
  payment.save();
  log.info('New Payment: {}', [payment.id]);

  let grant = Grant.load(event.address.toHexString());
  if (grant != null) {
    log.debug('Updating Grant for payment: {}', [grant.id]);
    let payments = grant.funds;
    payments.push(payment.id);
    grant.payments = payments;
    grant.save();
  } else {
    log.debug('Grant {} not found for payment {}', [
      event.address.toHexString(),
      payment.id,
    ]);
  }
}
