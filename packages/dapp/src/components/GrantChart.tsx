import {
  Box,
  Button,
  Flex,
  Grid,
  Select,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/core';
import { GrantChartPlot } from 'components/GrantChartPlot';
import { BigNumber, utils } from 'ethers';
import React, { useMemo, useState } from 'react';
import { parseGrantData } from 'utils/chart';
import { ONEWEEK, ONEYEAR } from 'utils/constants';
import { getVestedAmount } from 'utils/helpers';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
};

export const GrantChart: React.FC<Props> = ({ grant }) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const [streams, grantData, nodes, xMin, xMax, yMax] = useMemo(
    () => parseGrantData(grant),
    [grant],
  );
  const isDisabled = grantData.length === 0;

  const yMaxAt = (time: number): number => {
    const yMaxAtTime = streams.reduce((t, s) => {
      return t.add(getVestedAmount(s, time));
    }, BigNumber.from(0));
    return Number(utils.formatEther(yMaxAtTime));
  };

  const [past, setPast] = useState<number>(-1);
  const [future, setFuture] = useState<number>(-1);
  const yDomain = ((_p, f) => {
    return f === -1 || currentTime + f + ONEWEEK >= xMax
      ? [0, yMax * 1.2]
      : [0, yMaxAt(currentTime + f + ONEWEEK) * 1.2];
  })(past, future);

  const xDomain = ((p, f) => {
    const end = f === -1 ? xMax : currentTime + f;
    const start = p === -1 ? xMin : currentTime - p;
    return [start, end];
  })(past, future);

  const grid = isDisabled
    ? [1, 1]
    : [
        (currentTime - xDomain[0]) / (xDomain[1] - xDomain[0]),
        (xDomain[1] - currentTime) / (xDomain[1] - xDomain[0]),
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
        <Text fontWeight="bold" color="dark" fontSize="xl" flex={1} mr={2}>
          Grant Funds Over Time
        </Text>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 2, md: 8 }}
          align={{ base: 'flex-end', sm: 'stretch', md: 'center' }}
        >
          <Flex align="center">
            <Text
              fontWeight="600"
              mr={2}
              fontSize={{ base: '.6rem', md: '.8rem' }}
            >
              PAST
            </Text>
            <Select
              onChange={e => {
                setPast(Number(e.target.value));
                if (future === 0 && Number(e.target.value) === 0) {
                  setFuture(-1);
                }
              }}
              value={past}
              fontSize={{ base: '.6rem', md: '.8rem' }}
            >
              <option value={0}>None</option>
              <option value={ONEYEAR / 2}>6 months</option>
              <option value={ONEYEAR}>1 year</option>
              <option value={ONEYEAR * 2}>2 years</option>
              <option value={-1}>All time</option>
            </Select>
          </Flex>
          <Flex align="center">
            <Text
              fontWeight="600"
              mr={2}
              fontSize={{ base: '.6rem', md: '.8rem' }}
            >
              FUTURE
            </Text>
            <Select
              onChange={e => {
                setFuture(Number(e.target.value));
                if (past === 0 && Number(e.target.value) === 0) {
                  setPast(-1);
                }
              }}
              value={future}
              fontSize={{ base: '.6rem', md: '.8rem' }}
            >
              <option value={0}>None</option>
              <option value={ONEYEAR / 2}>6 months</option>
              <option value={ONEYEAR}>1 year</option>
              <option value={ONEYEAR * 2}>2 years</option>
              <option value={-1}>All time</option>
            </Select>
          </Flex>
          {past === -1 && future === -1 ? null : (
            <Button
              variant="link"
              onClick={() => {
                setPast(-1);
                setFuture(-1);
              }}
              textTransform="uppercase"
              textDecoration="underline lightgrey"
              justifyContent={{ base: 'flex-start', md: 'center' }}
              fontSize={{ base: '.6rem', md: '.8rem' }}
            >
              ALL TIME
            </Button>
          )}
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
            xDomain={xDomain}
            yDomain={yDomain}
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
          future === 0 || past === 0 ? undefined : `${grid[0]}fr ${grid[1]}fr`
        }
      >
        {past !== 0 && (
          <Text w="100%" textAlign="center" textTransform="uppercase">
            Vesting To Date
          </Text>
        )}
        {future !== 0 && (
          <Text w="100%" textAlign="center" textTransform="uppercase">
            Future (Projected)
          </Text>
        )}
      </Grid>
    </Flex>
  );
};
