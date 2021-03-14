import { Flex, Text } from '@chakra-ui/react';
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
    _hover={{ background: 'black10' }}
    borderRadius={4}
    transition="0.25s"
    px={1}
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
