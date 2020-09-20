import { Flex, HStack, Text } from '@chakra-ui/core';
import { FeaturedIcon } from 'icons/FeaturedIcon';
import { LatestIcon } from 'icons/LatestIcon';
import { TrendingIcon } from 'icons/TrendingIcon';
import React from 'react';
// import { InNeedIcon } from 'icons/InNeedIcon';

export const GrantsSorter: React.FC = () => (
  <HStack spacing={8} align="stretch">
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      color="gray.400"
      _hover={{ color: 'green.500' }}
      cursor="pointer"
      transition="0.25s"
    >
      <FeaturedIcon boxSize="4rem" />
      <Text fontWeight="600" fontSize="lg" textTransform="uppercase" mt={2}>
        Featured
      </Text>
    </Flex>
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      color="gray.400"
      _hover={{ color: 'green.500' }}
      cursor="pointer"
      transition="0.25s"
    >
      <LatestIcon boxSize="4.25rem" mt="-0.25rem" />
      <Text fontWeight="600" fontSize="lg" textTransform="uppercase" mt={2}>
        Latest
      </Text>
    </Flex>
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      color="gray.400"
      _hover={{ color: 'green.500' }}
      cursor="pointer"
      transition="0.25s"
    >
      <TrendingIcon boxSize="4rem" />
      <Text fontWeight="600" fontSize="lg" textTransform="uppercase" mt={2}>
        Trending
      </Text>
    </Flex>
    {/* 
      <Flex
        direction="column"
        align="center"
        justify="space-between"
        color="gray.400"
        _hover={{ color: 'green.500' }}
        cursor="pointer"
        transition="0.25s"
      >
        <InNeedIcon boxSize="4rem" />
        <Text fontWeight="600" fontSize="lg" textTransform="uppercase" mt={2}>
          In Need
        </Text>
      </VStack> 
    */}
  </HStack>
);