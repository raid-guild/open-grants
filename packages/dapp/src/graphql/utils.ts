import { BigNumber } from 'ethers';
import {
  GrantDetailsFragment,
  Stream as StreamGraph,
} from 'graphql/autogen/types';
import { Grant } from 'utils/grants';
import { Stream } from 'utils/streams';

type StreamFragment = Pick<
  StreamGraph,
  'funded' | 'startTime' | 'duration' | 'isRevoked' | 'released'
>;

export const parseStream = (input: StreamFragment): Stream => {
  const output: Stream = {
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

export const parseGrant = (input: GrantDetailsFragment): Grant => {
  const output: Grant = {
    id: input.id,
    createdBy: input.createdBy,
    timestamp: input.timestamp,
    grantees: input.grantees.map(g => g.toString()),
    amounts: input.amounts.map(a => Number(a)),
    name: input.name,
    description: input.description,
    link: input.link,
    contactLink: input.contactLink,
    funded: BigNumber.from(input.funded),
    pledged: BigNumber.from(input.funded).add(
      input.streams.reduce(
        (total, stream) => total.add(BigNumber.from(stream.funded)),
        BigNumber.from(0),
      ),
    ),
    vested: BigNumber.from(input.funded).add(
      input.streams.reduce(
        (total, stream) => total.add(getVestedAmount(stream)),
        BigNumber.from(0),
      ),
    ),
    streams: input.streams.map(s => parseStream(s)),
  };
  return output;
};
