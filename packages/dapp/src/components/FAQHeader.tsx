import { Text, VStack } from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
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
      <Text mb={8} textAlign="center">
        Common questions about the Open Grants Project
      </Text>
    </VStack>
  );
};
