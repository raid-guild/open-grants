import { Flex } from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { Loader } from 'components/Loader';
import React from 'react';

export const LoadingPage: React.FC = () => (
  <Flex
    w="100%"
    h="100vh"
    justify="center"
    align="center"
    bgImage={`url(${HeaderBG})`}
    bgSize="cover"
    bgRepeat="no-repeat"
    position="fixed"
    top={0}
    left={0}
  >
    <Loader />
  </Flex>
);
