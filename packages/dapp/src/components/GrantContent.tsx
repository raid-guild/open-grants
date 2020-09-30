import { VStack } from '@chakra-ui/core';
import { GrantChart } from 'components/GrantChart';
import React from 'react';
import { Grant } from 'utils/grants';

type Props = {
  grant: Grant;
};
export const GrantContent: React.FC<Props> = ({ grant }) => {
  return (
    <VStack w="100%" spacing={8} maxW="70rem" p={8} color="text">
      <GrantChart grant={grant} />
    </VStack>
  );
};
