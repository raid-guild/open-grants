import { log } from '@graphprotocol/graph-ts';

import {
  LogFunding,
  LogReleased,
  LogRevoked,
} from '../generated/EtherVesting/EtherVesting';
import { LogEtherVestingCreated } from '../generated/EtherVestingFactory/EtherVestingFactory';
import { Deposit, Grant, Release, Stream } from '../generated/schema';
import { fetchStreamInfo } from './helpers';

export function handleLogEtherVestingCreated(
  event: LogEtherVestingCreated,
): void {
  let stream = new Stream(event.params.vestingContract.toHexString());
  stream.factoryAddress = event.address;
  stream.owner = event.transaction.from;
  stream.timestamp = event.block.timestamp;
  stream.streamId = event.params.id;
  stream.streamAddress = event.params.vestingContract;

  let fetchedStream = fetchStreamInfo(event.params.vestingContract);
  stream.beneficiary = fetchedStream.beneficiary;
  stream.funded = fetchedStream.totalFunded;
  stream.isRevocable = fetchedStream.isRevocable;
  stream.isRevoked = fetchedStream.isRevoked;
  stream.released = fetchedStream.released;
  stream.startTime = fetchedStream.startTime;
  stream.duration = fetchedStream.duration;

  stream.deposits = new Array<string>();
  stream.releases = new Array<string>();

  let grant = Grant.load(fetchedStream.beneficiary.toHexString());
  if (grant != null) {
    log.debug('New Stream {} for Grant {}', [stream.id, grant.id]);
    let streams = grant.streams;
    streams.push(stream.id);
    grant.streams = streams;
    grant.save();

    stream.grant = grant.id;
  } else {
    log.debug('New Stream {} towards {}', [
      stream.id,
      fetchedStream.beneficiary.toHexString(),
    ]);
  }

  stream.save();
}

export function handleLogFunding(event: LogFunding): void {
  let deposit = new Deposit(event.logIndex.toHexString());
  deposit.streamAddress = event.address;
  deposit.depositer = event.params.donor;
  deposit.timestamp = event.block.timestamp;
  deposit.amount = event.params.value;
  deposit.save();

  let stream = Stream.load(event.address.toHexString());
  if (stream != null) {
    log.debug('New Deposit {} for Stream {}', [deposit.id, stream.id]);
    let deposits = stream.deposits;
    deposits.push(deposit.id);
    stream.deposits = deposits;
    let fetchedStream = fetchStreamInfo(event.address);
    stream.funded = fetchedStream.totalFunded;
    stream.save();
  } else {
    log.debug('Stream {} not found for Deposit {}', [
      event.address.toHexString(),
      deposit.id,
    ]);
  }
}

export function handleLogReleased(event: LogReleased): void {
  let release = new Release(event.logIndex.toHexString());
  release.streamAddress = event.address;
  release.releaser = event.transaction.from;
  release.timestamp = event.block.timestamp;
  release.amount = event.params.amount;
  release.save();

  let stream = Stream.load(event.address.toHexString());
  if (stream != null) {
    log.debug('Stream {} Released', [stream.id, release.id]);
    let releases = stream.releases;
    releases.push(release.id);
    stream.releases = releases;
    let fetchedStream = fetchStreamInfo(event.address);
    stream.released = fetchedStream.released;
    stream.save();
  } else {
    log.debug('Stream {} not found for Release {}', [
      event.address.toHexString(),
      release.id,
    ]);
  }
}

export function handleLogRevoked(event: LogRevoked): void {
  let stream = Stream.load(event.address.toHexString());
  if (stream != null) {
    log.debug('Stream {} Revoked', [stream.id]);
    stream.isRevoked = true;
    stream.save();
  } else {
    log.debug('Stream {} not found for Revoke {}', [
      event.address.toHexString(),
      event.logIndex.toHexString(),
    ]);
  }
}
