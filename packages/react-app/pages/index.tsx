import { Flex,HStack, SimpleGrid, Text, VStack } from '@chakra-ui/core';
import { GrantTile } from 'components/GrantTile';
import { HomeHeader } from 'components/HomeHeader';
import { getGrants } from 'graphql/getGrants';
import { FeaturedIcon } from 'icons/FeaturedIcon';
import { LatestIcon } from 'icons/LatestIcon';
import { TrendingIcon } from 'icons/TrendingIcon';
import { InferGetStaticPropsType } from 'next';
import React from 'react';
// import { InNeedIcon } from 'icons/InNeedIcon';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const grants = await getGrants();
  return {
    props: {
      grants: grants.filter(grant => grant.name !== ''),
      revalidate: true,
    },
  };
};

const Home: React.FC<Props> = ({ grants }) => (
  <VStack w="100%" spacing={8}>
    <HomeHeader />
    <HStack spacing={8} align="stretch">
      <Flex
        direction="column"
        align="center"
        justify="space-between"
        color="gray.400"
        _hover={{ color: 'green.500' }}
        cursor="pointer"
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
      >
        <InNeedIcon boxSize="4rem" />
        <Text fontWeight="600" fontSize="lg" textTransform="uppercase" mt={2}>
          In Need
        </Text>
      </VStack> 
    */}
    </HStack>
    <SimpleGrid
      columns={[1, null, 2, 3]}
      spacing={8}
      w="100%"
      maxW="70rem"
      px={8}
      mb={8}
    >
      {grants.map(grant => (
        <GrantTile key={grant.id} grant={grant} />
      ))}
    </SimpleGrid>
  </VStack>
);

export default Home;
