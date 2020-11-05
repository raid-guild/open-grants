import {
  Box,
  Flex,
  HStack,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/core';
import { Link } from 'components/Link';
import { utils } from 'ethers';
import React from 'react';
import { DataPoint } from 'utils/chart';
import { getVestedAmount } from 'utils/helpers';
import { Stream } from 'utils/types';

type HintProps = {
  value: DataPoint & { stream: number };
  streams: Array<Stream>;
};

export const ChartHint: React.FC<HintProps> = ({ value, streams }) => {
  const stream =
    value.stream >= 0 && value.stream < streams.length
      ? streams[value.stream]
      : undefined;
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
  const totalAmount = `${value.y.toFixed(2)} ETH`;

  const streamAmount = stream
    ? `${Math.abs(
        Number(utils.formatEther(getVestedAmount(stream, value.x))),
      ).toFixed(2)} ETH`
    : `0.00 ETH`;
  const h = '10rem !important';
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
            {totalAmount}
          </Text>
          <Text fontSize="sm" textAlign="center" color="dark">
            ({streamAmount})
          </Text>
          {stream && stream.ownerUser.id && stream.ownerUser.imageUrl ? (
            <Link to={`/profile/${stream.ownerUser.id}`}>
              <HStack spacing={2}>
                <Flex
                  borderRadius="50%"
                  border="1px solid #E6E6E6"
                  w="2rem"
                  h="2rem"
                  overflow="hidden"
                  background="white"
                  bgImage={`url(${stream.ownerUser.imageUrl})`}
                  bgSize="cover"
                  bgRepeat="no-repeat"
                  bgPosition="center center"
                />
                <Text fontSize="sm">
                  {stream.ownerUser.name
                    ? stream.ownerUser.name
                    : `${stream.ownerUser.id.slice(0, 7).toUpperCase()}...`}
                </Text>
              </HStack>
            </Link>
          ) : (
            <Text fontSize="sm"> Other </Text>
          )}
        </VStack>
      </PopoverContent>
    </Popover>
  );
};
