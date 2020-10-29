import {
  Box,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/core';
import React from 'react';
import { DataPoint } from 'utils/chart';
import { Stream } from 'utils/types';

type HintProps = {
  value: DataPoint & { stream: number };
  streams: Array<Stream>;
};

export const ChartHint: React.FC<HintProps> = ({ value /* , streams */ }) => {
  // const stream = streams[value.stream];
  const date = new Date(value.x * 1000);
  const ye = new Intl.DateTimeFormat('en', {
    year: 'numeric',
  }).format(date);
  const mo = new Intl.DateTimeFormat('en', {
    month: 'short',
  }).format(date);
  const da = new Intl.DateTimeFormat('en', {
    day: '2-digit',
  }).format(date);
  const dateString = `${da} ${mo} ${ye}`;
  const amountString = `${value.y.toFixed(2)} ETH`;
  const h = '5rem !important';
  const w = '10rem !important';
  return (
    <Popover isOpen placement="top">
      <PopoverTrigger>
        <Box
          w="1rem"
          h="1rem"
          borderRadius="50%"
          bgColor="green.500"
          transform="translate(1rem,0.5rem)"
        />
      </PopoverTrigger>
      <PopoverContent
        boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
        border="none"
        maxH={h}
        h={h}
        maxW={w}
        w={w}
        background="#D7FFEF"
        p={0}
      >
        <PopoverArrow />
        <VStack w={w} h={h} py={2} justify="center" fontFamily="body">
          <Text
            textTransform="uppercase"
            textAlign="center"
            color="text"
            fontSize="sm"
          >
            {dateString}
          </Text>
          <Text fontWeight="500" fontSize="xl" textAlign="center" color="dark">
            {amountString}
          </Text>
        </VStack>
      </PopoverContent>
    </Popover>
  );
};
