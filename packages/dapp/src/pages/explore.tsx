import { SimpleGrid, VStack } from '@chakra-ui/react';
import { ExploreHeader } from 'components/ExploreHeader';
import { GrantsSorter } from 'components/GrantsSorter';
import { GrantTile } from 'components/GrantTile';
import { LoadingPage } from 'components/LoadingPage';
import { getGrants } from 'graphql/getGrants';
import React, { useEffect, useState } from 'react';
import { Grant, Sort } from 'utils/types';

const Explore: React.FC = () => {
  const [grants, setGrants] = useState<Array<Grant>>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<Sort>(Sort.Featured);

  useEffect(() => {
    setLoading(true);
    getGrants(sort).then(result => {
      setGrants(result);
      setLoading(false);
    });
  }, [sort]);

  if (loading) {
    return <LoadingPage />;
  }
  const sortedGrants =
    sort === Sort.Featured
      ? grants.sort((a, b) => {
          if (a.vested.lt(b.vested)) {
            return 1;
          }
          if (a.vested.eq(b.vested)) {
            return 0;
          }
          return -1;
        })
      : grants;
  return (
    <VStack w="100%" spacing={8} mb={16}>
      <ExploreHeader />
      <GrantsSorter sort={sort} setSort={setSort} />
      <SimpleGrid
        columns={[1, null, 2, 3]}
        spacing={8}
        w="100%"
        maxW="70rem"
        px={{ base: 4, sm: 8 }}
        mb={8}
      >
        {sortedGrants.map(grant => (
          <GrantTile key={grant.id} grant={grant} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default Explore;
