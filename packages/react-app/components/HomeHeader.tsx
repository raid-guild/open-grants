import { Button, Image, Text, VStack } from '@chakra-ui/core';
import EthereumImage from 'assets/ethereum.svg';
import NextLink from 'next/link';
import React from 'react';

export const HomeHeader: React.FC = () => {
  return (
    <VStack
      pt="4rem"
      pb="5rem"
      px="2rem"
      spacing={8}
      w="100%"
      color="white"
      background="green.500"
    >
      <Text
        fontSize={{ base: '2rem', md: '3rem' }}
        fontWeight="800"
        textAlign="center"
      >
        Open Grants
      </Text>
      <Image src={EthereumImage} />
      <Text textAlign="center">
        Together we empower developers to build the next generation of ETH
      </Text>
      <NextLink href="/faq">
        <Button
          borderRadius="full"
          variant="outline"
          borderColor="white"
          _hover={{ background: 'green.600' }}
          px={10}
          fontWeight="500"
          size="lg"
        >
          Read the FAQ
        </Button>
      </NextLink>
    </VStack>
  );
};
