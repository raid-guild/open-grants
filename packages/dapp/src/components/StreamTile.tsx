import { Button, Flex, SimpleGrid, Text, VStack } from '@chakra-ui/core';
import { Link } from 'components/Link';
import React from 'react';
import { formatValue, getVestedAmount } from 'utils/helpers';
import { Stream } from 'utils/types';

type Props = {
  stream: Stream;
};
export const StreamTile: React.FC<Props> = ({ stream }) => {
  if (!stream) return null;
  const currentTime = Math.ceil(new Date().getTime() / 1000);
  const vested = getVestedAmount(stream, currentTime);
  return (
    <VStack
      style={{ backdropFilter: 'blur(7px)' }}
      rounded="lg"
      p={4}
      background="white"
      color="gray.500"
      align="stretch"
    >
      <Flex direction="column" align="flex-start">
        <Link
          to={`/grant/${stream.grantAddress}`}
          color="black"
          fontWeight="600"
          fontSize="2xl"
          mb={6}
        >
          {stream.grantName}
        </Link>
        <SimpleGrid columns={2} spacing={4} mb={16} letterSpacing="0.3px">
          <Flex direction="column">
            <Text fontWeight="500" fontSize="2xl">
              {`${formatValue(stream.funded)} ETH`}
            </Text>
            <Text textTransform="uppercase">Pledged</Text>
            <Text fontSize="sm">{`Start ${new Date(
              stream.startTime * 1000,
            ).toLocaleDateString()}`}</Text>
          </Flex>
          <Flex direction="column">
            <Text fontWeight="500" fontSize="2xl">
              {`${formatValue(vested)} ETH`}
            </Text>
            <Text textTransform="uppercase">Vested</Text>
            <Text fontSize="sm">{`End ${new Date(
              (stream.startTime + stream.duration) * 1000,
            ).toLocaleDateString()}`}</Text>
          </Flex>
        </SimpleGrid>
      </Flex>
      <Button
        bg="background"
        // _hover={{background: 'black20'}}
        textTransform="uppercase"
        w="100%"
        boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
      >
        Stop the stream
      </Button>
    </VStack>
  );
};
