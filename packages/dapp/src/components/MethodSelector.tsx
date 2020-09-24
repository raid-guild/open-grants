import { Button, ButtonGroup } from '@chakra-ui/core';
import { QuestionIcon } from 'icons/QuestionIcon';
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
        px={12}
      >
        All At Once
      </Button>
      <Button
        onClick={() => toggleSplit(true)}
        background={split ? 'gray.400' : 'gray.200'}
        _hover={{ background: 'gray.500' }}
        fontWeight="500"
        fontSize="md"
        px={12}
      >
        Stream
      </Button>
      <QuestionIcon
        position="absolute"
        right="-2rem"
        top="50%"
        transform="translateY(-50%)"
        cursor="pointer"
        transition="0.25s"
        color="text"
        _hover={{ color: 'green.500' }}
        boxSize="1.25rem"
      />
    </ButtonGroup>
  );
};
