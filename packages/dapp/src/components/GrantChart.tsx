import { Box, Flex, HStack, Text } from '@chakra-ui/core';
import React from 'react';
import { AreaSeries, FlexibleWidthXYPlot, XAxis, YAxis } from 'react-vis';
import { parseGrantData } from 'utils/chart';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
};

export const GrantChart: React.FC<Props> = ({ grant }) => {
  const [grantData, max] = parseGrantData(grant);
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
        h="420px"
        position="relative"
        borderLeft="1px solid #ccc"
        borderBottom="1px solid #ccc"
      >
        <FlexibleWidthXYPlot stackBy="y" yDomain={[0, max * 1.5]} height={420}>
          {grantData.map(data => (
            <AreaSeries
              key={data[0].x}
              curve="curveBasis"
              animation
              data={data}
              opacity={0.25}
              style={{}}
            />
          ))}
          <XAxis style={{ fontSize: '9px' }} />
          <YAxis style={{ fontSize: '9px' }} />
        </FlexibleWidthXYPlot>
      </Box>
      <Flex w="100%" justify="space-around" align="center" mt={4}>
        <Text textTransform="uppercase">Vesting To Date</Text>
        <Text textTransform="uppercase">Future (Projected)</Text>
      </Flex>
    </Flex>
  );
};
