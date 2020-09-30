import { SimpleGrid, VStack } from '@chakra-ui/core';
import { ExploreHeader } from 'components/ExploreHeader';
import { GrantsSorter } from 'components/GrantsSorter';
import { GrantTile } from 'components/GrantTile';
import { getGrants } from 'graphql/getGrants';
import React, { useEffect, useState } from 'react';
import { Grant } from 'utils/grants';

const Explore: React.FC = () => {
  const [grants, setGrants] = useState<Array<Grant>>([]);

  useEffect(() => {
    async function fetchGrants() {
      setGrants(await getGrants());
    }
    fetchGrants();
  }, []);
  return (
    <VStack w="100%" spacing={8} mb={16}>
      <ExploreHeader />
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
};

export default Explore;
