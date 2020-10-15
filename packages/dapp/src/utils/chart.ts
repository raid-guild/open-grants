import { BigNumber, utils } from 'ethers';
import { ONEWEEK } from 'utils/constants';
import { getVestedAmount } from 'utils/helpers';
import { Grant } from 'utils/types';

type DataPoint = {
  x: number;
  y: number;
};

// export const parseGrantData = (
//   grant: Grant,
// ): [Array<Array<DataPoint>>, number, number, number] => {
//   let xMin = new Date().getTime();
//   let xMax = 0;
//   let yMax = BigNumber.from(0);
//   const data0 = grant.streams
//     .filter(stream => !stream.isRevoked && stream.duration >= ONEWEEK)
//     .sort((a, b) => {
//       if (a.startTime < b.startTime) return 1;
//       if (a.startTime === b.startTime) return 0;
//       return -1;
//     })
//     .map(stream => {
//       const { startTime, duration } = stream;
//       if (startTime < xMin) xMin = startTime;
//       if (startTime + duration > xMax) xMax = startTime + duration;
//       if (stream.funded.gt(yMax)) yMax = stream.funded;
//       const points = new Array<DataPoint>();
//       for (let i = startTime; i < startTime + duration; i += ONEWEEK) {
//         points.push({
//           x: i,
//           y: Number(utils.formatEther(getVestedAmount(stream, i))),
//         });
//       }
//       return points;
//     });
//   const data1 = data0.map(points => {
//     const len = points.length;
//     const lastTimestamp = points[len - 1].x;
//     const lastValue = points[len - 1].y;
//     if (lastTimestamp < xMax) {
//       for (let i = lastTimestamp; i <= xMax; i += ONEWEEK) {
//         points.push({
//           x: i,
//           y: lastValue,
//         });
//       }
//     }
//     return points;
//   });
//   const data2 = new Array<Array<DataPoint>>();
//   if (data1.length > 0) {
//     data2.push(data1[0]);
//     for (let i = 1; i < data1.length; i += 1) {
//       const points = data1[i].map((point, j) => {
//         if (data1[i - 1][j]) {
//           return {
//             x: point.x,
//             y: point.y + data1[i - 1][j].y,
//             y0: data1[i - 1][j].y,
//           };
//         }
//         return {
//           x: point.x,
//           y: point.y + data1[i - 1][j - 1].y,
//           y0: data1[i - 1][j - 1].y,
//         };
//       });
//       data2.push(points);
//     }
//   }
//   return [data1, xMin, xMax, Number(utils.formatEther(yMax))];
// };

export const parseGrantData = (
  grant: Grant,
): [Array<Array<DataPoint>>, number, number, number] => {
  let xMin = new Date().getTime();
  let xMax = 0;
  let yMax = BigNumber.from(0);

  const data0 = grant.streams
    .filter(stream => !stream.isRevoked && stream.duration >= ONEWEEK)
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
  return [data1, xMin, xMax, Number(utils.formatEther(yMax))];
};
