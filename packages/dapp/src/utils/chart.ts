import { BigNumber, utils } from 'ethers';
import { ONEWEEK } from 'utils/constants';
import { getVestedAmount } from 'utils/helpers';
import { Grant } from 'utils/types';

type DataPoint = {
  x: number;
  y: number;
};

export const parseGrantData = (
  grant: Grant,
): [Array<Array<DataPoint>>, number] => {
  let max = BigNumber.from(0);
  const data = grant.streams
    .filter(stream => stream.duration >= ONEWEEK)
    .map(stream => {
      const { startTime, duration } = stream;
      if (stream.funded.gt(max)) max = stream.funded;
      const points = new Array<DataPoint>();
      for (let i = startTime; i < startTime + duration; i += ONEWEEK) {
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
