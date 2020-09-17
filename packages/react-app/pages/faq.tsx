import { VStack } from '@chakra-ui/core';
import { FAQHeader } from 'components/FAQHeader';
import { FAQContent } from 'components/FAQContent';
import React from 'react';

const FAQ: React.FC = () => (
  <VStack w="100%">
      <FAQHeader />
      <FAQContent />
  </VStack>
);

export default FAQ;
