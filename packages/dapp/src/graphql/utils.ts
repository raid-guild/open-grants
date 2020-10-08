import { BigNumber } from 'ethers';
import {
  Fund as FundGraph,
  GrantDetailsFragment,
  Stream as StreamGraph,
} from 'graphql/autogen/types';
import { Funder, Grant, Stream } from 'utils/types';

type StreamFragment = Pick<
  StreamGraph,
  'funded' | 'startTime' | 'duration' | 'isRevoked' | 'released' | 'owner'
>;

type FundFragment = Pick<FundGraph, 'donor' | 'amount'>;

export const parseStream = (input: StreamFragment): Stream => {
  const output: Stream = {
    owner: input.owner.toLowerCase(),
    funded: BigNumber.from(input.funded),
    released: BigNumber.from(input.released),
    startTime: Number(input.startTime),
    duration: Number(input.duration),
    isRevoked: Boolean(input.isRevoked),
  };
  return output;
};

export const getVestedAmount = (input: Stream | StreamFragment): BigNumber => {
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
      funder.funded.add(fund.amount);
    } else {
      fundersMap[fund.donor.toLowerCase()] = {
        id: fund.donor.toLowerCase(),
        funded: BigNumber.from(fund.amount),
        pledged: BigNumber.from(0),
        vested: BigNumber.from(0),
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
        vested: BigNumber.from(0),
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
    funder.vested = BigNumber.from(funder.funded).add(
      funder.streams.reduce(
        (total, stream) =>
          total.add(getVestedAmount(stream).sub(stream.released)),
        BigNumber.from(0),
      ),
    );
    return funder;
  });
};

export const parseGrant = (
  input: GrantDetailsFragment,
  funders = false,
): Grant => {
  const output: Grant = {
    id: input.id.toLowerCase(),
    createdBy: input.createdBy.toLowerCase(),
    timestamp: input.timestamp,
    grantees: input.grantees.map(g => g.toLowerCase()),
    amounts: input.amounts.map(a => Number(a)),
    name: input.name,
    description: input.description,
    link: input.link,
    contactLink: input.contactLink,
    funded: BigNumber.from(input.funded),
    pledged: BigNumber.from(input.funded).add(
      input.streams.reduce(
        (total, stream) =>
          total.add(BigNumber.from(stream.funded).sub(stream.released)),
        BigNumber.from(0),
      ),
    ),
    vested: BigNumber.from(input.funded).add(
      input.streams.reduce(
        (total, stream) =>
          total.add(getVestedAmount(stream).sub(stream.released)),
        BigNumber.from(0),
      ),
    ),
    streams: input.streams.map(s => parseStream(s)),
    funders: undefined,
  };
  if (funders) {
    output.funders = parseFunders(input.funds, output.streams);
  }
  return output;
};
