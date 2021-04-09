import { Flex, HStack, Text } from '@chakra-ui/react';
import { FeaturedIcon } from 'icons/FeaturedIcon';
// import { InNeedIcon } from 'icons/InNeedIcon';
import { LatestIcon } from 'icons/LatestIcon';
import { TrendingIcon } from 'icons/TrendingIcon';
import React from 'react';
import { Link } from 'react-router-dom';
import { Sort } from 'utils/types';

type Props = {
  sort: Sort;
};

export const GrantsSorter: React.FC<Props> = ({ sort }) => (
  <HStack spacing={8} align="stretch" color="gray.400">
    <Link to="/explore#featured">
      <Flex
        direction="column"
        align="center"
        justify="space-between"
        color={sort === Sort.Featured ? 'green.500' : 'gray.400'}
        _hover={{ color: 'green.500' }}
        cursor="pointer"
        transition="0.25s"
      >
        <FeaturedIcon boxSize="4rem" />
        <Text fontWeight="600" fontSize="lg" textTransform="uppercase" mt={2}>
          Featured
        </Text>
      </Flex>
    </Link>
    <Link to="/explore#latest">
      <Flex
        direction="column"
        align="center"
        justify="space-between"
        color={sort === Sort.Latest ? 'green.500' : 'gray.400'}
        _hover={{ color: 'green.500' }}
        cursor="pointer"
        transition="0.25s"
      >
        <LatestIcon boxSize="4.25rem" mt="-0.25rem" />
        <Text fontWeight="600" fontSize="lg" textTransform="uppercase" mt={2}>
          Latest
        </Text>
      </Flex>
    </Link>
    <Link to="/explore#trending">
      <Flex
        direction="column"
        align="center"
        justify="space-between"
        color={sort === Sort.Trending ? 'green.500' : 'gray.400'}
        _hover={{ color: 'green.500' }}
        cursor="pointer"
        transition="0.25s"
      >
        <TrendingIcon boxSize="4rem" />
        <Text fontWeight="600" fontSize="lg" textTransform="uppercase" mt={2}>
          Trending
        </Text>
      </Flex>
    </Link>
    {/* 
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      _hover={{ color: 'green.500' }}
      cursor="pointer"
      transition="0.25s"
    >
      <InNeedIcon boxSize="4rem" />
      <Text fontWeight="600" fontSize="lg" textTransform="uppercase" mt={2}>
        In Need
      </Text>
    </Flex>
    */}
  </HStack>
);
