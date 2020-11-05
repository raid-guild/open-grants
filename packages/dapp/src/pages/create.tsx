import { Flex, VStack } from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { CreateGrantForm } from 'components/CreateGrantForm';
import React from 'react';

const Create: React.FC = () => (
  <VStack w="100%">
    <Flex bgSize="cover" bgImage={`url(${HeaderBG})`} h="5rem" w="100%" />
    <CreateGrantForm />
  </VStack>
);

export default Create;
