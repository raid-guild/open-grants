import {
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { SearchIcon } from 'icons/SearchIcon';
import React from 'react';

export const FAQHeader: React.FC = () => {
  return (
    <VStack
      py="5rem"
      px="2rem"
      w="100%"
      justify="center"
      color="white"
      bgImage={`url(${HeaderBG})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      minH="35rem"
    >
      <Text
        fontSize={{ base: '2rem', md: '3rem' }}
        fontWeight="800"
        textAlign="center"
      >
        FAQ
      </Text>
      <Text mb={8}>Common questions about the Open Grants Project</Text>
      <InputGroup
        maxW="26rem"
        size="lg"
        color="text"
        background="white60"
        borderRadius="full"
        variant="solid"
      >
        <InputLeftElement mx={1} pointerEvents="none">
          <SearchIcon />
        </InputLeftElement>
        <Input
          background="transparent"
          border="none"
          mx={2}
          fontSize="md"
          placeholder="SEARCH"
          px={10}
        />
      </InputGroup>
    </VStack>
  );
};
