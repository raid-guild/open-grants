import { log } from '@graphprotocol/graph-ts';

import {
  LogDeposit,
  LogReleased,
  LogRevoked,
} from '../generated/EtherVesting/EtherVesting';
import { LogEtherVestingCreated } from '../generated/EtherVestingFactory/EtherVestingFactory';
import { Deposit, Release, Stream } from '../generated/schema';
import { fetchStreamInfo } from './helpers';

export function handleLogEtherVestingCreated(
  event: LogEtherVestingCreated,
): void {
  const stream = new Stream(event.params.vestingContract.toHexString());
  stream.factoryAddress = event.address;
  stream.owner = event.transaction.from;
  stream.streamId = event.params.id;
  stream.streamAddress = event.params.vestingContract;

  const fetchedStream = fetchStreamInfo(event.params.vestingContract);
  stream.beneficiary = fetchedStream.beneficiary;
  stream.isRevocable = fetchedStream.isRevocable;
  stream.isRevoked = fetchedStream.isRevoked;
  stream.released = fetchedStream.released;
  stream.startTime = fetchedStream.startTime;
  stream.duration = fetchedStream.duration;

  stream.deposits = new Array<string>();
  stream.releases = new Array<string>();

  stream.save();
  log.info('New Stream {}', [stream.id]);
}

export function handleLogDeposit(event: LogDeposit): void {
  const deposit = new Deposit(event.logIndex.toHexString());
  deposit.streamAddress = event.address;
  deposit.depositer = event.params.sender;
  deposit.amount = event.params.amount;
  deposit.save();
  log.info('New Payment: {}', [deposit.id]);

  const stream = Stream.load(event.address.toHexString());
  if (stream != null) {
    log.debug('Updating Stream for deposit: {}', [stream.id]);
    const { deposits } = stream;
    deposits.push(deposit.id);
    stream.deposits = deposits;
    stream.save();
  } else {
    log.debug('Stream {} not found for deposit {}', [
      event.address.toHexString(),
      deposit.id,
    ]);
  }
}

export function handleLogReleased(event: LogReleased): void {
  const release = new Release(event.logIndex.toHexString());
  release.streamAddress = event.address;
  release.amount = event.params.amount;
  release.save();
  log.info('New Payment: {}', [release.id]);

  const stream = Stream.load(event.address.toHexString());
  if (stream != null) {
    log.debug('Updating Stream for release: {}', [stream.id]);
    const { releases } = stream;
    releases.push(release.id);
    stream.releases = releases;
    const fetchedStream = fetchStreamInfo(event.address);
    stream.released = fetchedStream.released;
    stream.save();
  } else {
    log.debug('Stream {} not found for release {}', [
      event.address.toHexString(),
      release.id,
    ]);
  }
}

export function handleLogRevoked(event: LogRevoked): void {
  const stream = Stream.load(event.address.toHexString());
  if (stream != null) {
    log.debug('Updating Stream for revoke: {}', [stream.id]);
    stream.isRevoked = true;
    stream.save();
  } else {
    log.debug('Stream {} not found for revoke', [event.address.toHexString()]);
  }
}
