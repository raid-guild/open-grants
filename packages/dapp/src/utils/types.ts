import { BigNumber } from 'ethers';

export enum Sort {
  Latest,
  Featured,
  Trending,
}

export type Grantee = {
  address: string;
  amount: string | number;
  description: string;
};

export type GrantMetadata = {
  name: string;
  description: string;
  link: string;
  contactLink: string;
  grantees: Grantee[];
};

export type Stream = {
  id: string;
  owner: string;
  funded: BigNumber;
  withdrawn: BigNumber;
  released: BigNumber;
  startTime: number;
  duration: number;
  isRevoked: boolean;
  revokeTime: number;
  grantName: string;
  grantAddress: string;
};

export type Funder = {
  id: string;
  funded: BigNumber;
  pledged: BigNumber;
  withdrawn: BigNumber;
  streams: Array<Stream>;
};

export type Grant = {
  id: string;
  createdBy: string;
  timestamp: number;
  grantees: Array<Grantee>;
  name: string;
  description: string;
  link: string;
  contactLink: string;
  funded: BigNumber;
  pledged: BigNumber;
  vested: BigNumber;
  streams: Array<Stream>;
  funders: Array<Funder> | undefined;
};

export type Profile = {
  id: string;
  grantsReceived: Array<Grant>;
  grantsFunded: Array<Grant>;
  streams: Array<Stream>;
  pledged: BigNumber;
  earned: BigNumber;
  funded: BigNumber;
  withdrawn: BigNumber;
  streamed: BigNumber;
};

export type User = {
  id: string;
  pledged: BigNumber;
  earned: BigNumber;
  funded: BigNumber;
  withdrawn: BigNumber;
  streamed: BigNumber;
};

export type BoxProfile = {
  address: string;
  name: string;
  emoji: string;
  imageHash: string;
  imageUrl: string;
};
