import { Box, Button, Flex, Grid, HStack, Text } from '@chakra-ui/core';
import React, { useState } from 'react';
import {
  AreaSeries,
  FlexibleWidthXYPlot,
  LineSeries,
  XAxis,
  YAxis,
} from 'react-vis';
import { MAX_STACK, parseGrantData } from 'utils/chart';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
};

enum ChartState {
  ALLTIME,
  PAST,
  FUTURE,
}

const chartColors = ['#D7FFEF', '#E6FFFE', '#AEEAFF', '#C7DDFF'];

export const GrantChart: React.FC<Props> = ({ grant }) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const [grantData, xMin, xMax, currentYMax, yMax] = parseGrantData(
    currentTime,
    grant,
  );
  const isDisabled = grantData.length === 0;

  const [state, setState] = useState<ChartState>(ChartState.ALLTIME);

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

  const grid = isDisabled
    ? [1, 1]
    : [
        (currentTime - xMin) / (xMax - xMin),
        (xMax - currentTime) / (xMax - xMin),
      ];

  return (
    <Flex
      w="100%"
      background="white"
      boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
      borderRadius="0.5rem"
      px={12}
      py={8}
      position="relative"
      color="text"
      direction="column"
    >
      <Flex w="100%" justify="space-between" align="center" mb={4}>
        <Text fontWeight="bold" color="black" fontSize="xl">
          Grant Funds Over Time
        </Text>
        <HStack spacing={8}>
          <Button
            variant="link"
            onClick={() => setState(ChartState.ALLTIME)}
            textTransform="uppercase"
            isDisabled={isDisabled || state === ChartState.ALLTIME}
          >
            All Time
          </Button>
          <Button
            variant="link"
            onClick={() => setState(ChartState.PAST)}
            textTransform="uppercase"
            isDisabled={isDisabled || state === ChartState.PAST}
          >
            Past
          </Button>
          <Button
            variant="link"
            onClick={() => setState(ChartState.FUTURE)}
            textTransform="uppercase"
            isDisabled={isDisabled || state === ChartState.FUTURE}
          >
            Future
          </Button>
        </HStack>
      </Flex>
      <Text
        position="absolute"
        left={4}
        top="50%"
        transform="rotate(-90deg) translateX(50%)"
        textTransform="uppercase"
      >
        ETH
      </Text>
      <Box
        w="100%"
        h="100%"
        maxH="26.25rem"
        position="relative"
        borderLeft="1px solid #ccc"
        borderBottom="1px solid #ccc"
      >
        {isDisabled && (
          <Flex
            position="absolute"
            justify="center"
            align="center"
            w="100%"
            h="100%"
            background="haze"
          >
            <Text color="text">No Streams found</Text>
          </Flex>
        )}
        <FlexibleWidthXYPlot
          stackBy="y"
          height={420}
          yDomain={yDomain}
          xDomain={xDomain}
        >
          {grantData.map((data, i) => (
            <AreaSeries
              key={data[i].x}
              curve="curveBasis"
              animation
              data={data}
              fill={chartColors[i % MAX_STACK]}
              stroke={chartColors[i % MAX_STACK]}
            />
          ))}
          <XAxis
            style={{ fontSize: '9px', opacity: '0.75' }}
            tickTotal={10}
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
          <YAxis style={{ fontSize: '9px', opacity: '0.75' }} tickTotal={10} />
          {!isDisabled && (
            <AreaSeries
              data={[
                { x: currentTime, y: yMax * 1.5 },
                { x: xMax, y: yMax * 1.5 },
              ]}
              fill="rgba(255, 255, 255, 0.35)"
              stroke="rgba(255, 255, 255, 0.35)"
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
            />
          )}
        </FlexibleWidthXYPlot>
        {!isDisabled && (
          <Grid
            w="100%"
            h="100%"
            pl={8}
            position="absolute"
            left={0}
            top={0}
            templateColumns={
              state === ChartState.ALLTIME
                ? `${grid[0]}fr ${grid[1]}fr`
                : undefined
            }
          >
            {state === ChartState.FUTURE && (
              <Text
                position="absolute"
                left={8}
                top="15%"
                transform="rotate(-90deg) translateX(50%)"
                textTransform="uppercase"
                color="green.500"
              >
                TODAY
              </Text>
            )}
            {state === ChartState.PAST && (
              <Text
                position="absolute"
                right={0}
                top="15%"
                transform="rotate(-90deg) translateX(50%)"
                textTransform="uppercase"
                color="green.500"
              >
                TODAY
              </Text>
            )}
            {state === ChartState.ALLTIME && (
              <>
                <Box w="100%" h="100%" position="relative">
                  <Text
                    position="absolute"
                    right={-4}
                    top="15%"
                    transform="rotate(-90deg) translateX(50%)"
                    textTransform="uppercase"
                    color="green.500"
                  >
                    TODAY
                  </Text>
                </Box>
              </>
            )}
          </Grid>
        )}
      </Box>
      <Grid
        w="100%"
        mt={4}
        pl={8}
        fontSize="sm"
        templateColumns={
          state === ChartState.ALLTIME ? `${grid[0]}fr ${grid[1]}fr` : undefined
        }
      >
        {state !== ChartState.FUTURE && (
          <Text w="100%" textAlign="center" textTransform="uppercase">
            Vesting To Date
          </Text>
        )}
        {state !== ChartState.PAST && (
          <Text w="100%" textAlign="center" textTransform="uppercase">
            Future (Projected)
          </Text>
        )}
      </Grid>
    </Flex>
  );
};
