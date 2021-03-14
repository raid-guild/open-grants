import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  ipfs,
  json,
  log,
} from '@graphprotocol/graph-ts';

import { EtherVesting } from '../generated/EtherVesting/EtherVesting';
import { UnmanagedGrant } from '../generated/UnmanagedGrant/UnmanagedGrant';
import { User } from '../generated/schema';

class GrantObject {
  uri: Bytes;
  totalFunded: BigInt;
  name: string;
  description: string;
  link: string;
  contactLink: string;

  constructor() {
    this.uri = new Bytes(1);
    this.totalFunded = BigInt.fromI32(0);
    this.name = '';
    this.description = '';
    this.link = '';
    this.contactLink = '';
  }
}

// Helper adding 0x12 and 0x20 to make the proper ipfs hash
// the returned bytes32 is so [0,31]
export function addQm(a: ByteArray): ByteArray {
  let out = new Uint8Array(34);
  out[0] = 0x12;
  out[1] = 0x20;
  for (let i = 0; i < 32; i++) {
    out[i + 2] = a[i];
  }
  return out as ByteArray;
}

export function fetchGrantInfo(address: Address): GrantObject {
  let grantInstance = UnmanagedGrant.bind(address);
  let grantObject = new GrantObject();

  let uri = grantInstance.try_getUri();
  let totalFunding = grantInstance.try_getTotalFunding();

  if (!totalFunding.reverted) {
    grantObject.totalFunded = totalFunding.value;
  }

  if (!uri.reverted) {
    grantObject.uri = uri.value;
    let hexHash = addQm(uri.value) as Bytes;
    let base58Hash = hexHash.toBase58();
    let getIPFSData = ipfs.cat(base58Hash);
    log.debug('IPFS uri {} hash {}', [uri.value.toHexString(), base58Hash]);
    if (getIPFSData != null) {
      let data = json.fromBytes(getIPFSData as Bytes).toObject();
      let name = data.get('name');
      if (name != null) {
        grantObject.name = name.toString();
      }
      let description = data.get('description');
      if (description != null) {
        grantObject.description = description.toString();
      }
      let link = data.get('link');
      if (link != null) {
        grantObject.link = link.toString();
      }
      let contactLink = data.get('contactLink');
      if (contactLink != null) {
        grantObject.contactLink = contactLink.toString();
      }
    }
  }

  return grantObject;
}

class StreamObject {
  beneficiary: Bytes;
  totalFunded: BigInt;
  isRevocable: boolean;
  isRevoked: boolean;
  released: BigInt;
  startTime: BigInt;
  duration: BigInt;

  constructor() {
    this.beneficiary = new Bytes(1);
    this.totalFunded = BigInt.fromI32(0);
    this.isRevocable = false;
    this.isRevoked = false;
    this.released = BigInt.fromI32(0);
    this.startTime = BigInt.fromI32(0);
    this.duration = BigInt.fromI32(0);
  }
}

export function fetchStreamInfo(address: Address): StreamObject {
  let streamInstance = EtherVesting.bind(address);
  let streamObject = new StreamObject();

  let beneficiary = streamInstance.try_beneficiary();
  let totalFunding = streamInstance.try_getTotalFunding();
  let isRevocable = streamInstance.try_revocable();
  let isRevoked = streamInstance.try_revoked();
  let released = streamInstance.try_released();
  let startTime = streamInstance.try_start();
  let duration = streamInstance.try_duration();

  if (!beneficiary.reverted) {
    streamObject.beneficiary = beneficiary.value;
  }

  if (!totalFunding.reverted) {
    streamObject.totalFunded = totalFunding.value;
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

function newUser(address: Bytes): User {
  let user = new User(address.toHexString());
  user.address = address;
  user.grantsReceived = new Array<string>();
  user.grantsFunded = new Array<string>();
  user.streams = new Array<string>();
  user.funded = BigInt.fromI32(0);
  user.pledged = BigInt.fromI32(0);
  user.streamed = BigInt.fromI32(0);
  user.withdrawn = BigInt.fromI32(0);
  user.earned = BigInt.fromI32(0);
  log.debug('New User {}', [address.toHexString()]);
  return user;
}

export function getUser(address: Bytes): User {
  let user = User.load(address.toHexString());
  if (user == null) {
    user = newUser(address);
  }
  // let profile = box.profile(user.address.toHexString()) as TypedMap<
  //   string,
  //   JSONValue
  // >;

  // let profileName = profile.get('name');
  // if (profileName) {
  //   user.name = profileName.toString();
  // }
  // let profileEmoji = profile.get('emoji');
  // if (profileEmoji) {
  //   user.emoji = profileEmoji.toString();
  // }

  // let profileImages = profile.get('image');
  // if (profileImages) {
  //   let profileImagesArray = profileImages.toArray();
  //   if (profileImagesArray.length > 0) {
  //     let profileImage = profileImagesArray[0].toObject().get('contentUrl');
  //     if (profileImage) {
  //       let profileImageHash = profileImage.toObject().get('/');
  //       if (profileImageHash) {
  //         user.imageHash = profileImageHash.toString();
  //       }
  //     }
  //   }
  // }
  log.debug('Updated User {}', [address.toHexString()]);
  return user as User;
}

// let PAST_DURATION_SECS = BigInt.fromI32(15780000); // 6 months
// let PAST_DURATION_SECS = BigInt.fromI32(24 * 60 * 60); // one day

// export function getRecentFunds(
//   funds: Array<string>
// ): BigInt {
//   let currentTime = BigInt.fromI32(new Date().getTime() / 1000);
//   let total = BigInt.fromI32(0);
//   for (let i = 0; i < funds.length; i = i + 1) {
//     let fund = Fund.load(funds[i]);
//     if (
//       fund != null &&
//       fund.timestamp >= currentTime.minus(PAST_DURATION_SECS)
//     ) {
//       total = total.plus(fund.amount);
//     }
//   }
//   return total;
// }
