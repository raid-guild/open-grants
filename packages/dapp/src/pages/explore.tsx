import { SimpleGrid, VStack } from '@chakra-ui/react';
import { ExploreHeader } from 'components/ExploreHeader';
import { GrantsSorter } from 'components/GrantsSorter';
import { GrantTile } from 'components/GrantTile';
import { LoadingPage } from 'components/LoadingPage';
import { getGrants } from 'graphql/getGrants';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Grant, Sort } from 'utils/types';

const getSortedGrants = (sort: Sort, grants: Grant[]): Grant[] => {
  switch (sort) {
    case Sort.Featured:
      return grants.sort((a, b) => {
        if (a.vested.lt(b.vested)) {
          return 1;
        }
        if (a.vested.eq(b.vested)) {
          return 0;
        }
        return -1;
      });
    case Sort.Trending:
      return grants.sort((a, b) => {
        if (a.pledged.lt(b.pledged)) {
          return 1;
        }
        if (a.pledged.eq(b.pledged)) {
          return 0;
        }
        return -1;
      });
    case Sort.Latest:
    default:
      return grants;
  }
};

const Explore: React.FC = () => {
  const [grants, setGrants] = useState<Array<Grant>>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<Sort>(Sort.Featured);

  useEffect(() => {
    setLoading(true);
    getGrants(sort).then(result => {
      setGrants(getSortedGrants(sort, result));
      setLoading(false);
    });
  }, [sort]);

  const { hash } = useLocation();

  useEffect(() => {
    switch (hash) {
      case '#trending':
        setSort(Sort.Trending);
        break;
      case '#latest':
        setSort(Sort.Latest);
        break;
      case '#featured':
      default:
        setSort(Sort.Featured);
    }
  }, [hash]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <VStack w="100%" spacing={8} mb={16}>
      <ExploreHeader />
      <GrantsSorter sort={sort} />
      <SimpleGrid
        columns={[1, null, 2, 3]}
        spacing={8}
        w="100%"
        maxW="70rem"
        px={{ base: 4, sm: 8 }}
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
