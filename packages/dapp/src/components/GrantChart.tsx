import { Box, Flex, HStack, Text } from '@chakra-ui/core';
import React from 'react';
import { AreaSeries, FlexibleWidthXYPlot, XAxis, YAxis } from 'react-vis';
import { parseGrantData } from 'utils/chart';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
};

export const GrantChart: React.FC<Props> = ({ grant }) => {
  const [grantData, xMin, xMax, yMax] = parseGrantData(grant);
  // eslint-disable-next-line
  console.log({ xMin, xMax, yMax });

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
          <Text textTransform="uppercase">All Time</Text>
          <Text textTransform="uppercase">Past</Text>
          <Text textTransform="uppercase">Future</Text>
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
        {grantData.length === 0 && (
          <Flex
            position="absolute"
            justify="center"
            align="center"
            w="100%"
            h="100%"
            background="black10"
          >
            <Text color="text">No Streams found</Text>
          </Flex>
        )}
        <FlexibleWidthXYPlot stackBy="y" height={420} yDomain={[0, yMax * 1.2]}>
          {grantData.map((data, i) => (
            <AreaSeries
              key={data[i].x}
              curve="curveBasis"
              animation
              data={data}
              opacity={0.25}
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
              return `${mo}'${ye}`;
            }}
          />
          <YAxis style={{ fontSize: '9px', opacity: '0.75' }} tickTotal={10} />
        </FlexibleWidthXYPlot>
      </Box>
      <Flex w="100%" justify="space-around" align="center" mt={4}>
        <Text textTransform="uppercase">Vesting To Date</Text>
        <Text textTransform="uppercase">Future (Projected)</Text>
      </Flex>
    </Flex>
  );
};
