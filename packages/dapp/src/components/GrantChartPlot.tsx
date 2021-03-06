import { useBreakpointValue } from '@chakra-ui/react';
import { ChartHint } from 'components/ChartHint';
import React, { useEffect, useState } from 'react';
import {
  AreaSeries,
  FlexibleWidthXYPlot,
  Hint,
  LabelSeries,
  LineSeries,
  MarkSeries,
  XAxis,
  YAxis,
} from 'react-vis';
import { DataPoint, MAX_STACK } from 'utils/chart';
import { ONEMONTH } from 'utils/constants';
import { Stream } from 'utils/types';

type PlotProps = {
  streams: Array<Stream>;
  grantData: Array<Array<DataPoint>>;
  nodes: Array<DataPoint & { stream: number }>;
  weeklyNodes: Array<DataPoint & { stream: number }>;
  currentTime: number;
  xDomain: Array<number>;
  yDomain: Array<number>;
  chartHeight: number;
  mouseLeave: boolean;
};

const chartColors = ['#8AE0DB', '#7BD3D3', '#A4DFD7', '#75DEC6', '#69D1B9'];

export const GrantChartPlot: React.FC<PlotProps> = ({
  streams,
  grantData,
  nodes,
  weeklyNodes,
  currentTime,
  xDomain,
  yDomain,
  chartHeight,
  mouseLeave,
}) => {
  const [hoveredNode, setHoveredNode] = useState<
    DataPoint & { stream: number }
  >();
  const isMonths = xDomain[1] - xDomain[0] < 6 * ONEMONTH;
  const isWeeks = xDomain[1] - xDomain[0] <= 2 * ONEMONTH;
  const filteredNodes = isMonths
    ? nodes.filter(
        node =>
          node.x >= xDomain[0] &&
          node.x <= xDomain[1] &&
          node.y >= yDomain[0] &&
          node.y <= yDomain[1],
      )
    : weeklyNodes.filter(
        node =>
          node.x >= xDomain[0] &&
          node.x <= xDomain[1] &&
          node.y >= yDomain[0] &&
          node.y <= yDomain[1],
      );
  const xTicks = useBreakpointValue({ base: 0, sm: 4, md: 8, lg: 10 });
  const yTicks = useBreakpointValue({ base: 5, md: 10 });
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });

  useEffect(() => {
    if (mouseLeave) {
      setHoveredNode(undefined);
    }
  }, [mouseLeave]);

  return (
    <FlexibleWidthXYPlot
      stackBy="y"
      height={chartHeight || 420}
      yDomain={yDomain}
      xDomain={xDomain}
    >
      <XAxis
        style={{ fontSize: '9px', opacity: '0.75' }}
        tickTotal={xTicks}
        tickFormat={d => {
          const date = new Date(d * 1000);
          const ye = new Intl.DateTimeFormat('en', {
            year: '2-digit',
          }).format(date);
          const mo = new Intl.DateTimeFormat('en', {
            month: 'short',
          }).format(date);
          const da = new Intl.DateTimeFormat('en', {
            day: '2-digit',
          }).format(date);
          return isWeeks ? `${da}-${mo}` : `${mo}-${ye}`;
        }}
      />
      <YAxis style={{ fontSize: '9px', opacity: '0.75' }} tickTotal={yTicks} />
      {grantData.map((data, i) => (
        <AreaSeries
          key={data[i].x}
          curve="curveBasis"
          animation
          data={data}
          fill={chartColors[i % MAX_STACK]}
          stroke={chartColors[i % MAX_STACK]}
          style={{ pointerEvents: 'none' }}
        />
      ))}
      <AreaSeries
        data={[
          { x: currentTime, y: yDomain[1] * 1.5 },
          { x: xDomain[1] * 1.5, y: yDomain[1] * 1.5 },
        ]}
        fill="rgba(255, 255, 255, 0.35)"
        stroke="rgba(255, 255, 255, 0.35)"
        style={{ pointerEvents: 'none' }}
      />
      <LineSeries
        data={[
          { x: currentTime, y: 0 },
          { x: currentTime, y: yDomain[1] * 1.5 },
        ]}
        strokeWidth={2}
        stroke="#23CEA5"
        strokeStyle="solid"
        style={{ pointerEvents: 'none' }}
      />
      <LabelSeries
        animation
        allowOffsetToBeReversed
        data={[
          {
            x: currentTime,
            y: 0.8 * yDomain[1],
            label: 'TODAY',
            rotation: 90,
          },
        ]}
        style={{ stroke: '3bdeb7' }}
      />
      {hoveredNode && !isSmallScreen && (
        <Hint
          value={hoveredNode}
          align={{ vertical: 'top', horizontal: 'left' }}
        >
          <ChartHint value={hoveredNode} streams={streams} isWeeks={isWeeks} />
        </Hint>
      )}
      {!isSmallScreen && (
        <MarkSeries
          data={filteredNodes}
          onNearestXY={node => {
            const n = {
              x: Number(node.x),
              y: Number(node.y),
              stream: Number(node.stream),
            };
            setHoveredNode(n);
          }}
          opacity={0}
        />
      )}
    </FlexibleWidthXYPlot>
  );
};
