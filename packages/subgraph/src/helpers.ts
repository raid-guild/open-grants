import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';

import { EtherVesting } from '../generated/EtherVesting/EtherVesting';
import { UnmanagedStream } from '../generated/UnmanagedStream/UnmanagedStream';

class GrantObject {
  uri: Bytes;

  totalFunded: BigInt;
}

export function fetchGrantInfo(address: Address): GrantObject | null {
  const grantInstance = UnmanagedStream.bind(address);
  const grantObject = new GrantObject();

  const uri = grantInstance.try_getUri();
  const totalFunding = grantInstance.try_getTotalFunding();

  if (!totalFunding.reverted) {
    grantObject.totalFunded = totalFunding.value;
  }

  if (!uri.reverted) {
    grantObject.uri = uri.value;
  }

  return grantObject;
}

class StreamObject {
  beneficiary: Bytes;

  isRevocable: boolean;

  isRevoked: boolean;

  released: BigInt;

  startTime: BigInt;

  duration: BigInt;
}

export function fetchStreamInfo(address: Address): StreamObject | null {
  const streamInstance = EtherVesting.bind(address);
  const streamObject = new StreamObject();

  const beneficiary = streamInstance.try_beneficiary();
  const isRevocable = streamInstance.try_revocable();
  const isRevoked = streamInstance.try_revoked();
  const released = streamInstance.try_released();
  const startTime = streamInstance.try_start();
  const duration = streamInstance.try_duration();

  if (!beneficiary.reverted) {
    streamObject.beneficiary = beneficiary.value;
  }

  if (!isRevocable.reverted) {
    streamObject.isRevocable = isRevocable.value;
  }

  if (!isRevoked.reverted) {
    streamObject.isRevoked = isRevoked.value;
  }

  if (!released.reverted) {
    streamObject.released = released.value;
  }

  if (!startTime.reverted) {
    streamObject.startTime = startTime.value;
  }

  if (!duration.reverted) {
    streamObject.duration = duration.value;
  }

  return streamObject;
}
