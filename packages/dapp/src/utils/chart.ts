import { BigNumber, utils } from 'ethers';
import { ONEWEEK } from 'utils/constants';
import { getVestedAmount } from 'utils/helpers';
import { Grant, Stream } from 'utils/types';

type DataPoint = {
  x: number;
  y: number;
};

export const MAX_STACK = 5;

const reduceStreams = (input: Array<Stream>): Array<Stream> => {
  const filtered = input
    .filter(stream => !stream.isRevoked && stream.duration >= ONEWEEK)
    .sort((a, b) => {
      if (a.funded.lt(b.funded)) return 1;
      if (a.funded.eq(b.funded)) return 0;
      return -1;
    });
  if (filtered.length < MAX_STACK) {
    return filtered;
  }
  const last = filtered.slice(MAX_STACK - 1);
  const squashed = last.reduce(
    (res, s) => {
      if (res.startTime > s.startTime) res.startTime = s.startTime;
      if (res.startTime + res.duration < s.startTime + s.duration) {
        res.duration = s.startTime + s.duration - res.startTime;
      }
      res.funded = res.funded.add(s.funded);
      return res;
    },
    {
      id: 'squashed',
      owner: 'squashed',
      funded: BigNumber.from(0),
      released: BigNumber.from(0),
      startTime: Number.MAX_SAFE_INTEGER,
      duration: 0,
      isRevoked: false,
      grantName: 'squashed',
      grantAddress: 'squashed',
    },
  );
  const output = filtered.slice(0, MAX_STACK - 1);
  output.push(squashed);
  return output;
};

export const parseGrantData = (
  currentTime: number,
  grant: Grant,
): [Array<Array<DataPoint>>, number, number, number, number] => {
  let xMin = Number.MAX_SAFE_INTEGER;
  let xMax = 0;
  let yMax = BigNumber.from(0);
  let currentYMax = BigNumber.from(0);

  const streams = reduceStreams(grant.streams);

  const data0 = streams
    .sort((a, b) => {
      if (a.startTime < b.startTime) return 1;
      if (a.startTime === b.startTime) return 0;
      return -1;
    })
    .map(stream => {
      const { startTime, duration } = stream;
      if (startTime < xMin) xMin = startTime;
      if (startTime + duration > xMax) xMax = startTime + duration;
      yMax = yMax.add(stream.funded);
      currentYMax = currentYMax.add(getVestedAmount(stream, currentTime));
      return stream;
    });

  const data1 = data0.map(stream => {
    const { startTime, duration } = stream;
    const points = new Array<DataPoint>();
    for (let i = xMin; i <= xMax; i += ONEWEEK) {
      if (i < startTime) {
        points.push({
          x: i,
          y: 0,
        });
      } else if (i < startTime + duration) {
        points.push({
          x: i,
          y: Number(utils.formatEther(getVestedAmount(stream, i))),
        });
      } else {
        points.push({
          x: i,
          y: Number(
            utils.formatEther(getVestedAmount(stream, startTime + duration)),
          ),
        });
      }
    }
    return points;
  });
  return [
    data1,
    xMin,
    xMax,
    Number(utils.formatEther(currentYMax)),
    Number(utils.formatEther(yMax)),
  ];
};
