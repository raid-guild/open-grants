import { BigNumber } from 'ethers';
import {
  Fund as FundGraph,
  GrantDetailsFragment,
  StreamDetailsFragment,
  User as UserGraph,
  UserDetailsFragment,
} from 'graphql/autogen/types';
import { Funder, Grant, Grantee, Profile, Stream, User } from 'utils/types';

type FundFragment = Pick<FundGraph, 'donor' | 'amount'>;

export const parseStream = (input: StreamDetailsFragment): Stream => {
  const output: Stream = {
    id: input.id.toLowerCase(),
    owner: input.owner.toLowerCase(),
    funded: BigNumber.from(input.funded),
    withdrawn: BigNumber.from(input.withdrawn),
    released: BigNumber.from(input.released),
    startTime: Number(input.startTime),
    duration: Number(input.duration),
    isRevoked: Boolean(input.isRevoked),
    revokeTime: Number(input.revokeTime),
    grantName: input.grant ? input.grant.name : '',
    grantAddress: input.grant ? input.grant.id : '',
  };
  return output;
};

export const getVestedAmount = (
  input: Stream | StreamDetailsFragment,
): BigNumber => {
  const currentTime = Math.ceil(new Date().getTime() / 1000);
  if (currentTime >= Number(input.startTime) + Number(input.duration)) {
    return BigNumber.from(input.funded);
  }
  return BigNumber.from(input.funded)
    .mul(currentTime - input.startTime)
    .div(input.duration);
};

export const parseFunders = (
  funds: Array<FundFragment>,
  streams: Array<Stream>,
): Array<Funder> => {
  const fundersMap: { [any: string]: Funder } = {};
  funds.map(fund => {
    if (fund.donor.toLowerCase() in fundersMap) {
      const funder = fundersMap[fund.donor.toLowerCase()];
      funder.funded = funder.funded.add(fund.amount);
    } else {
      fundersMap[fund.donor.toLowerCase()] = {
        id: fund.donor.toLowerCase(),
        funded: BigNumber.from(fund.amount),
        pledged: BigNumber.from(0),
        withdrawn: BigNumber.from(0),
        streams: [],
      };
    }
    return fund.donor;
  });
  streams.map(stream => {
    if (stream.owner in fundersMap) {
      const funder = fundersMap[stream.owner];
      funder.streams.push(stream);
    } else {
      fundersMap[stream.owner] = {
        id: stream.owner,
        funded: BigNumber.from(0),
        pledged: BigNumber.from(0),
        withdrawn: BigNumber.from(0),
        streams: [stream],
      };
    }
    return stream.owner;
  });
  return [...Object.keys(fundersMap)].map(id => {
    const funder = fundersMap[id];
    funder.pledged = BigNumber.from(funder.funded).add(
      funder.streams.reduce(
        (total, stream) =>
          total.add(BigNumber.from(stream.funded).sub(stream.released)),
        BigNumber.from(0),
      ),
    );
    funder.withdrawn = BigNumber.from(0).add(
      funder.streams.reduce(
        (total, stream) => total.add(BigNumber.from(stream.withdrawn)),
        BigNumber.from(0),
      ),
    );
    return funder;
  });
};

type GranteeDescriptions = {
  [grantee: string]: string;
};

const reduceDescriptions = (output: GranteeDescriptions, input: Grantee) => {
  return {
    ...output,
    [input.address.toLowerCase()]: input.description,
  };
};

export const parseGrant = (
  input: GrantDetailsFragment,
  funders = false,
): Grant => {
  const granteesData: Grantee[] = input.granteesData
    ? JSON.parse(input.granteesData)
    : [];
  const granteeDescriptions: GranteeDescriptions = granteesData.reduce(
    reduceDescriptions,
    {},
  );
  const output: Grant = {
    id: input.id.toLowerCase(),
    createdBy: input.createdBy.toLowerCase(),
    timestamp: input.timestamp,
    grantees: input.grantees.map(
      (g: string, i: number): Grantee => ({
        address: g.toLowerCase(),
        amount: Number(input.amounts[i]),
        description: granteeDescriptions[g.toLowerCase()],
      }),
    ),
    name: input.name,
    description: input.description,
    link: input.link,
    contactLink: input.contactLink,
    funded: BigNumber.from(input.funded),
    pledged: BigNumber.from(input.funded).add(
      input.streams.reduce(
        (total, stream) =>
          total.add(
            BigNumber.from(stream.funded)
              .sub(stream.released)
              .sub(stream.withdrawn),
          ),
        BigNumber.from(0),
      ),
    ),
    vested: input.streams
      .filter(stream => !stream.isRevoked)
      .reduce(
        (total, stream) =>
          total.add(getVestedAmount(stream).sub(stream.released)),
        BigNumber.from(0),
      ),
    streams: input.streams.map(s => parseStream(s)),
    funders: undefined,
  };
  if (funders) {
    output.funders = parseFunders(input.funds, output.streams);
  }
  return output;
};

type ProfileFragment = Pick<
  UserGraph,
  'id' | 'funded' | 'earned' | 'pledged' | 'withdrawn' | 'streamed'
> & {
  grantsReceived: Array<GrantDetailsFragment>;
  grantsFunded: Array<GrantDetailsFragment>;
  streams: Array<StreamDetailsFragment>;
};

export const parseProfile = (input: ProfileFragment): Profile => {
  return {
    id: input.id.toLowerCase(),
    grantsReceived: input.grantsReceived.map(grant => parseGrant(grant, false)),
    grantsFunded: input.grantsFunded.map(grant => parseGrant(grant, false)),
    streams: input.streams.map(s => parseStream(s)),
    funded: BigNumber.from(input.funded),
    earned: BigNumber.from(input.earned),
    pledged: BigNumber.from(input.pledged),
    withdrawn: BigNumber.from(input.withdrawn),
    streamed: BigNumber.from(input.streamed),
  };
};

export const parseUser = (input: UserDetailsFragment): User => {
  return {
    id: input.id.toLowerCase(),
    funded: BigNumber.from(input.funded),
    earned: BigNumber.from(input.earned),
    pledged: BigNumber.from(input.pledged),
    withdrawn: BigNumber.from(input.withdrawn),
    streamed: BigNumber.from(input.streamed),
  };
};
