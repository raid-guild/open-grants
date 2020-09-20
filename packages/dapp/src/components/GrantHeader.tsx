import { Button, Text, VStack } from '@chakra-ui/core';
import { Link } from 'components/Link';
import { Grant } from 'graphql/autogen/types';
import React from 'react';

type Props = {
  grant: Grant;
};
export const GrantHeader: React.FC<Props> = ({ grant }) => {
  return (
    <VStack
      px="2rem"
      w="100%"
      justify="center"
      color="white"
      background="green.500"
      minH="30rem"
    >
      <Text
        fontSize={{ base: '2rem', md: '3rem' }}
        fontWeight="800"
        textAlign="center"
      >
        {grant.name}
      </Text>
      <Text>{grant.description}</Text>
      <Link to={grant.link} isExternal mb={8}>
        {grant.link}
      </Link>
      <Button
        borderRadius="full"
        variant="solid"
        color="dark"
        background="cyan.100"
        _hover={{ background: 'cyan.200' }}
        size="lg"
        fontWeight="500"
        px={10}
      >
        Fund this grant
      </Button>
    </VStack>
  );
};
