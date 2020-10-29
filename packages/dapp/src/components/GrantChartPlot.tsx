import { useBreakpointValue } from '@chakra-ui/core';
import { ChartHint } from 'components/ChartHint';
import React, { useState } from 'react';
import {
  AreaSeries,
  FlexibleWidthXYPlot,
  Hint,
  LineSeries,
  MarkSeries,
  XAxis,
  YAxis,
} from 'react-vis';
import { ChartState, DataPoint, MAX_STACK } from 'utils/chart';
import { Stream } from 'utils/types';

type PlotProps = {
  streams: Array<Stream>;
  grantData: Array<Array<DataPoint>>;
  nodes: Array<DataPoint & { stream: number }>;
  currentTime: number;
  currentYMax: number;
  yMax: number;
  xMin: number;
  xMax: number;
  state: ChartState;
  isDisabled: boolean;
};

const chartColors = ['#8AE0DB', '#7BD3D3', '#A4DFD7', '#75DEC6', '#69D1B9'];

export const GrantChartPlot: React.FC<PlotProps> = ({
  streams,
  grantData,
  nodes,
  currentTime,
  currentYMax,
  yMax,
  xMin,
  xMax,
  state,
  isDisabled,
}) => {
  const [hoveredNode, setHoveredNode] = useState<
    DataPoint & { stream: number }
  >();

  const yDomain = ((s: ChartState) => {
    switch (s) {
      case ChartState.PAST:
        return [0, currentYMax * 1.2];
      case ChartState.FUTURE:
      case ChartState.ALLTIME:
      default:
        return [0, yMax * 1.2];
    }
  })(state);

  const xDomain = ((s: ChartState) => {
    switch (s) {
      case ChartState.PAST:
        return [xMin, currentTime];
      case ChartState.FUTURE:
        return [currentTime, xMax];
      case ChartState.ALLTIME:
      default:
        return [xMin, xMax];
    }
  })(state);

  const xTicks = useBreakpointValue({ base: 0, sm: 4, md: 8, lg: 10 });
  const yTicks = useBreakpointValue({ base: 5, md: 10 });
  const chartHeight = useBreakpointValue({ base: 320, sm: 420 });
  return (
    <FlexibleWidthXYPlot
      stackBy="y"
      height={chartHeight || 420}
      yDomain={yDomain}
      xDomain={xDomain}
      onMouseLeave={() => setHoveredNode(undefined)}
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
          return `${da}-${mo}-${ye}`;
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
      {!isDisabled && (
        <AreaSeries
          data={[
            { x: currentTime, y: yMax * 1.5 },
            { x: xMax, y: yMax * 1.5 },
          ]}
          fill="rgba(255, 255, 255, 0.35)"
          stroke="rgba(255, 255, 255, 0.35)"
          style={{ pointerEvents: 'none' }}
        />
      )}
      {!isDisabled && (
        <LineSeries
          data={[
            { x: currentTime, y: 0 },
            { x: currentTime, y: yMax * 1.5 },
          ]}
          strokeWidth={2}
          stroke="#23CEA5"
          strokeStyle="solid"
          style={{ pointerEvents: 'none' }}
        />
      )}
      {hoveredNode && (
        <Hint
          value={hoveredNode}
          align={{ vertical: 'top', horizontal: 'left' }}
        >
          <ChartHint value={hoveredNode} streams={streams} />
        </Hint>
      )}
      <MarkSeries
        data={nodes}
        onNearestXY={node => {
          setHoveredNode({
            x: Number(node.x),
            y: Number(node.y),
            stream: Number(node.stream),
          });
        }}
        opacity={0}
      />
    </FlexibleWidthXYPlot>
  );
};
