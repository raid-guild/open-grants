import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';

import { EtherVesting } from '../generated/EtherVesting/EtherVesting';
import { UnmanagedStream } from '../generated/UnmanagedStream/UnmanagedStream';

class GrantObject {
  uri: Bytes;

  totalFunded: BigInt;
}

export function fetchGrantInfo(address: Address): GrantObject | null {
  let grantInstance = UnmanagedStream.bind(address);
  let grantObject = new GrantObject();

  let uri = grantInstance.try_getUri();
  let totalFunding = grantInstance.try_getTotalFunding();

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
  let streamInstance = EtherVesting.bind(address);
  let streamObject = new StreamObject();

  let beneficiary = streamInstance.try_beneficiary();
  let isRevocable = streamInstance.try_revocable();
  let isRevoked = streamInstance.try_revoked();
  let released = streamInstance.try_released();
  let startTime = streamInstance.try_start();
  let duration = streamInstance.try_duration();

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
