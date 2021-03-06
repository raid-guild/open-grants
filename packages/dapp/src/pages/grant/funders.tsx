import { Box, VStack } from '@chakra-ui/react';
import { GrantFunders } from 'components/GrantFunders';
import { GrantHeader } from 'components/GrantHeader';
import { LoadingPage } from 'components/LoadingPage';
import { getGrant } from 'graphql/getGrant';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grant } from 'utils/types';

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
    getGrant(grantAddress.toLowerCase()).then(g => setGrant(g));
  }, [grantAddress]);

  if (grant === undefined) {
    return <LoadingPage />;
  }
  if (grant === null) {
    return <Box mt="5rem"> Grant not found </Box>;
  }
  return (
    <VStack w="100%" mb={16}>
      <GrantHeader grant={grant} />
      {grant.funders && (
        <GrantFunders grantAddress={grant.id} funders={grant.funders} page />
      )}
    </VStack>
  );
};

export default GrantPage;
