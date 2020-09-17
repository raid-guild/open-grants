import { SimpleGrid, VStack } from '@chakra-ui/core';
import { GrantsSorter } from 'components/GrantsSorter';
import { GrantTile } from 'components/GrantTile';
import { HomeHeader } from 'components/HomeHeader';
import { getGrants } from 'graphql/getGrants';
import { InferGetStaticPropsType } from 'next';
import React from 'react';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
  const grants = await getGrants();
  return {
    props: {
      grants,
      revalidate: 1,
    },
  };
};

const Home: React.FC<Props> = ({ grants }) => (
  <VStack w="100%" spacing={8}>
    <HomeHeader />
    <GrantsSorter />
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
