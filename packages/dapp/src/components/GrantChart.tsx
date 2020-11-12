import {
  Box,
  Button,
  Flex,
  Grid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/core';
import { GrantChartPlot } from 'components/GrantChartPlot';
import React, { useState } from 'react';
import { ChartState, parseGrantData } from 'utils/chart';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
};

export const GrantChart: React.FC<Props> = ({ grant }) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const [
    streams,
    grantData,
    nodes,
    xMin,
    xMax,
    currentYMax,
    yMax,
  ] = parseGrantData(currentTime, grant);
  const isDisabled = grantData.length === 0;

  const [state, setState] = useState<ChartState>(ChartState.ALLTIME);

  const grid = isDisabled
    ? [1, 1]
    : [
        (currentTime - xMin) / (xMax - xMin),
        (xMax - currentTime) / (xMax - xMin),
      ];

  const chartHeight = useBreakpointValue({ base: 320, sm: 420 });

  return (
    <Flex
      w="100%"
      background="white"
      boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
      borderRadius="0.5rem"
      px={{ base: 8, md: 12 }}
      py={8}
      position="relative"
      color="text"
      direction="column"
    >
      <Flex w="100%" align="center" mb={4}>
        <Text fontWeight="bold" color="dark" fontSize="xl" flex={1}>
          Grant Funds Over Time
        </Text>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 0, md: 8 }}
        >
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
        </Stack>
      </Flex>
      <Text
        position="absolute"
        left={{ base: 2, md: 4 }}
        top="50%"
        transform="rotate(-90deg) translateX(50%)"
        textTransform="uppercase"
      >
        ETH
      </Text>
      <Box
        w="100%"
        h={`${chartHeight}px`}
        position="relative"
        borderLeft="1px solid #ccc"
        borderBottom="1px solid #ccc"
      >
        {isDisabled ? (
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
        ) : (
          <GrantChartPlot
            streams={streams}
            grantData={grantData}
            nodes={nodes}
            currentTime={currentTime}
            currentYMax={currentYMax}
            yMax={yMax}
            xMin={xMin}
            xMax={xMax}
            state={state}
            chartHeight={chartHeight}
          />
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
