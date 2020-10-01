import { SimpleGrid,VStack } from '@chakra-ui/core';
import { GrantChart } from 'components/GrantChart';
import { GrantDetails } from 'components/GrantDetails';
import { GrantFunders } from 'components/GrantFunders';
import { GrantRecipients } from 'components/GrantRecipients';
import React from 'react';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
};
export const GrantContent: React.FC<Props> = ({ grant }) => {
  return (
    <VStack w="100%" spacing={8} maxW="70rem" p={8} color="text" mb={16}>
      <GrantChart grant={grant} />
      <GrantDetails grant={grant} />
      <SimpleGrid columns={2} spacing={8} w="100%">
        <GrantRecipients grantees={grant.grantees} amounts={grant.amounts} />
        {grant.funders && <GrantFunders funders={grant.funders} />}
      </SimpleGrid>
    </VStack>
  );
};
