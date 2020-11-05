import { Flex, Text } from '@chakra-ui/core';
import React from 'react';

type Props = {
  amount: string;
  label: string;
};

export const AmountDisplay: React.FC<Props> = ({ amount, label }) => (
  <Flex
    direction="column"
    h="100%"
    justify="space-between"
    _hover={{ color: 'text' }}
    transition="0.25s"
  >
    <Text
      fontWeight="500"
      fontSize={{ base: 'lg', sm: '2xl', md: '3xl' }}
      textAlign="center"
    >
      {amount}
    </Text>
    <Text
      textTransform="uppercase"
      textAlign="center"
      fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
    >
      {label}
    </Text>
  </Flex>
);
