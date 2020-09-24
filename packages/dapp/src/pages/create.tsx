import { VStack } from '@chakra-ui/core';
import { CreateGrantForm } from 'components/CreateGrantForm';
import React from 'react';

const Create: React.FC = () => (
  <VStack w="100%" pt="5rem">
    <CreateGrantForm />
  </VStack>
);

export default Create;
