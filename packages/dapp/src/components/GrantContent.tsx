import { SimpleGrid, VStack } from '@chakra-ui/react';
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
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="100%">
        <GrantRecipients grantAddress={grant.id} grantees={grant.grantees} />
        {grant.funders && (
          <GrantFunders
            grantAddress={grant.id}
            funders={grant.funders.sort((a, b) => {
              if (a.funded.lt(b.funded)) return 1;
              if (a.funded.eq(b.funded)) return 0;
              return -1;
            })}
          />
        )}
      </SimpleGrid>
    </VStack>
  );
};
