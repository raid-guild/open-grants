import { BigNumber, utils } from 'ethers';
import { Grant, Stream } from 'utils/types';

import { ONEDAY } from './constants';

type DataPoint = {
  x: number;
  y: number;
};

const getVestedAmount = (input: Stream, currentTime: number): BigNumber => {
  if (currentTime >= Number(input.startTime) + Number(input.duration)) {
    return input.funded;
  }
  return input.funded.mul(currentTime - input.startTime).div(input.duration);
};

export const parseGrantData = (
  grant: Grant,
): [Array<Array<DataPoint>>, number] => {
  let max = BigNumber.from(0);
  const data = grant.streams.map(stream => {
    const { startTime, duration } = stream;
    if (stream.funded.gt(max)) max = stream.funded;
    const points = new Array<DataPoint>();
    for (let i = startTime; i < startTime + duration; i += ONEDAY) {
      points.push({
        x: i,
        y: Number(utils.formatEther(getVestedAmount(stream, i))),
      });
    }
    return points;
  });
  // eslint-disable-next-line no-console
  console.log({
    grant: grant.id,
    streams: grant.streams,
    data,
    max: Number(utils.formatEther(max)),
  });
  return [data, Number(utils.formatEther(max))];
};
