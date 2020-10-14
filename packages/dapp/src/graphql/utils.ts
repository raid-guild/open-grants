import { BigNumber } from 'ethers';
import {
  Fund as FundGraph,
  GrantDetailsFragment,
  StreamDetailsFragment,
} from 'graphql/autogen/types';
import { Funder, Grant, Profile, Stream } from 'utils/types';

type FundFragment = Pick<FundGraph, 'donor' | 'amount'>;

export const parseStream = (input: StreamDetailsFragment): Stream => {
  const output: Stream = {
    id: input.id.toLowerCase(),
    owner: input.owner.toLowerCase(),
    funded: BigNumber.from(input.funded),
    released: BigNumber.from(input.released),
    startTime: Number(input.startTime),
    duration: Number(input.duration),
    isRevoked: Boolean(input.isRevoked),
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

type ProfileFragment = {
  myGrants: Array<GrantDetailsFragment>;
  fundedGrants: Array<GrantDetailsFragment>;
  streams: Array<StreamDetailsFragment>;
};

export const parseProfile = (
  account: string,
  input: ProfileFragment,
): Profile => {
  return {
    myGrants: input.myGrants.map(grant => parseGrant(grant, false)),
    fundedGrants: input.fundedGrants.map(grant => parseGrant(grant, false)),
    streams: input.streams.map(s => parseStream(s)),
    pledged: input.fundedGrants
      .reduce((total, grant) => {
        const funds = grant.funds
          .filter(fund => fund.donor === account)
          .reduce((t, f) => t.add(BigNumber.from(f.amount)), BigNumber.from(0));
        return total.add(funds);
      }, BigNumber.from(0))
      .add(
        input.streams.reduce(
          (total, stream) =>
            total.add(BigNumber.from(stream.funded).sub(stream.released)),
          BigNumber.from(0),
        ),
      ),
    earned: input.myGrants.reduce((total, grant) => {
      const index = grant.grantees.indexOf(account);
      const amount = grant.amounts[index];
      const totalAmount = grant.amounts.reduce((t, a) => t + a, 0);
      const totalFunds = grant.funds.reduce(
        (t, f) => t.add(BigNumber.from(f.amount)),
        BigNumber.from(0),
      );
      const funds = totalFunds.mul(amount).div(totalAmount);
      return total.add(funds);
    }, BigNumber.from(0)),
  };
};
