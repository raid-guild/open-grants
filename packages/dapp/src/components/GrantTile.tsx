import {
  Button,
  Flex,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/core';
import { Link, LinkButton } from 'components/Link';
import { Grant } from 'graphql/autogen/types';
import React from 'react';
import { formatValue } from 'utils/helpers';

type Props = {
  grant: Grant;
};
export const GrantTile: React.FC<Props> = ({ grant }) => {
  if (!grant) return null;
  const pledged = BigInt('20000000000000000000');
  const vested = BigInt('12000000000000000000');
  return (
    <VStack
      style={{ backdropFilter: 'blur(7px)' }}
      rounded="lg"
      p={4}
      background="white"
      color="gray.500"
      align="stretch"
    >
      <Flex p={2} flex={1}>
        <Flex direction="column" align="flex-start" flex={1}>
          <Link
            to={`/grant/${grant.grantAddress}`}
            color="black"
            fontWeight="600"
            fontSize="2xl"
            mb={6}
          >
            {grant.name}
          </Link>
          <Text fontSize="sm" mb={8}>
            {grant.description}
          </Text>
          <Spacer />
          <SimpleGrid columns={2} spacing={4} mb={16} letterSpacing="0.3px">
            <Flex direction="column">
              <Text fontWeight="500" fontSize="2xl">
                {`${formatValue(pledged)} ETH`}
              </Text>
              <Text textTransform="uppercase">Pledged</Text>
            </Flex>
            <Flex direction="column">
              <Text fontWeight="500" fontSize="2xl">
                {`${formatValue(vested)} ETH`}
              </Text>
              <Text textTransform="uppercase">Vested</Text>
            </Flex>
          </SimpleGrid>
        </Flex>
        <Flex direction="column-reverse" justify="flex-end">
          <Flex
            background="background"
            borderRadius="50%"
            border="1px solid #E6E6E6"
            w="2.5rem"
            h="2.5rem"
            mb={-2}
          />
          <Flex
            border="1px solid #E6E6E6"
            background="background"
            borderRadius="50%"
            w="2.5rem"
            h="2.5rem"
            mb={-2}
          />
        </Flex>
      </Flex>
      <SimpleGrid columns={2} spacing={4}>
        <LinkButton
          to={`/grant/${grant.grantAddress}`}
          bg="background"
          colorScheme="gray"
          textTransform="uppercase"
          w="100%"
        >
          Details
        </LinkButton>
        <Button colorScheme="green" textTransform="uppercase" w="100%">
          Fund
        </Button>
      </SimpleGrid>
    </VStack>
  );
};
