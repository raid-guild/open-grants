import { BigNumber } from 'ethers';

export type Stream = {
  id: string;
  owner: string;
  funded: BigNumber;
  released: BigNumber;
  startTime: number;
  duration: number;
  isRevoked: boolean;
  grantName: string;
  grantAddress: string;
};

export type VestedStream = Stream & {
  vested: BigNumber;
};

export type Funder = {
  id: string;
  funded: BigNumber;
  pledged: BigNumber;
  vested: BigNumber;
  streams: Array<Stream>;
};

export type Grant = {
  id: string;
  createdBy: string;
  timestamp: number;
  grantees: Array<string>;
  amounts: Array<number>;
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
  myGrants: Array<Grant>;
  fundedGrants: Array<Grant>;
  streams: Array<Stream>;
  pledged: BigNumber;
  earned: BigNumber;
};
