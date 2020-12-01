import { Button, ButtonGroup } from '@chakra-ui/core';
import React from 'react';

type Props = {
  split: boolean;
  toggleSplit: React.Dispatch<React.SetStateAction<boolean>>;
};
export const MethodSelector: React.FC<Props> = ({ split, toggleSplit }) => {
  return (
    <ButtonGroup
      isAttached
      variant="solid"
      color="white"
      size="lg"
      position="relative"
    >
      <Button
        onClick={() => toggleSplit(false)}
        background={split ? 'gray.200' : 'gray.400'}
        _hover={{ background: 'gray.500' }}
        fontWeight="500"
        fontSize="md"
        px={{ base: 4, sm: 8, md: 12 }}
      >
        All At Once
      </Button>
      <Button
        onClick={() => toggleSplit(true)}
        background={split ? 'gray.400' : 'gray.200'}
        _hover={{ background: 'gray.500' }}
        fontWeight="500"
        fontSize="md"
        px={{ base: 4, sm: 8, md: 12 }}
      >
        Stream
      </Button>
    </ButtonGroup>
  );
};
