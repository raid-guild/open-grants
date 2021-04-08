import { CONFIG } from 'config';
import { BigNumber } from 'ethers';
import { isAddress } from 'utils/helpers';
import { BoxProfile, Profile } from 'utils/types';

export const getProfile = async (account: string): Promise<BoxProfile> => {
  const address = account.toLowerCase();
  const profile: BoxProfile = {
    address,
    name: '',
    emoji: '',
    imageHash: '',
    imageUrl: `https://avatars.dicebear.com/api/jdenticon/${address}.svg`,
  };
  const response = await fetch(
    `${CONFIG.boxEndpoint}/profile?address=${encodeURIComponent(address)}`,
  );
  if (response.ok && response.status === 200) {
    const boxProfile = await response.json();
    const imageHash =
      boxProfile &&
      boxProfile.image &&
      boxProfile.image[0] &&
      boxProfile.image[0].contentUrl &&
      boxProfile.image[0].contentUrl['/'];
    if (imageHash) {
      profile.imageHash = imageHash;
      profile.imageUrl = `${CONFIG.ipfsEndpoint}/ipfs/${imageHash}`;
    }
    profile.name = boxProfile.name;
    profile.emoji = boxProfile.emoji;
  }
  return profile;
};

export const fetchUser = async (account: string): Promise<Profile | null> => {
  const address = isAddress(account);
  if (!address) return null;
  const boxProfile = await getProfile(address);
  const profile = {
    id: address,
    name: boxProfile.name,
    imageHash: boxProfile.imageHash,
    imageUrl: boxProfile.imageUrl,
    grantsReceived: [],
    grantsFunded: [],
    streams: [],
    pledged: BigNumber.from(0),
    earned: BigNumber.from(0),
    funded: BigNumber.from(0),
    withdrawn: BigNumber.from(0),
    streamed: BigNumber.from(0),
  };
  return profile;
};
