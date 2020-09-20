import { Box, VStack } from '@chakra-ui/core';
import { GrantHeader } from 'components/GrantHeader';
import { Grant } from 'graphql/autogen/types';
import { getGrant } from 'graphql/getGrant';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  grantAddress: string;
}

type Props = RouteComponentProps<MatchParams>;

const GrantPage: React.FC<Props> = ({
  match: {
    params: { grantAddress },
  },
}) => {
  const [grant, setGrant] = useState<Grant | null | undefined>();

  useEffect(() => {
    async function fetchGrant() {
      setGrant(await getGrant(grantAddress));
    }
    fetchGrant();
  }, [grantAddress]);

  if (grant === undefined) {
    return <Box> Loading ... </Box>;
  }
  if (grant === null) {
    return <Box> Grant not found </Box>;
  }
  return (
    <VStack w="100%">
      <GrantHeader grant={grant} />
    </VStack>
  );
};

export default GrantPage;
