import { Button, ButtonGroup } from '@chakra-ui/core';
import { QuestionIcon } from 'icons/QuestionIcon';
import React from 'react';

export const SIXMONTHS = 15768000;

type Props = {
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
};
export const DurationSelector: React.FC<Props> = ({
  duration,
  setDuration,
}) => {
  return (
    <ButtonGroup
      isAttached
      variant="solid"
      color="white"
      size="lg"
      position="relative"
    >
      <Button
        onClick={() => setDuration(SIXMONTHS)}
        background={duration === SIXMONTHS ? 'gray.400' : 'gray.200'}
        _hover={{ background: 'gray.500' }}
        fontWeight="500"
        fontSize="md"
        px={12}
      >
        6 months
      </Button>
      <Button
        onClick={() => setDuration(SIXMONTHS * 2)}
        background={duration === SIXMONTHS * 2 ? 'gray.400' : 'gray.200'}
        _hover={{ background: 'gray.500' }}
        fontWeight="500"
        fontSize="md"
        px={12}
      >
        1 year
      </Button>
      <Button
        onClick={() => setDuration(SIXMONTHS * 4)}
        background={duration === SIXMONTHS * 4 ? 'gray.400' : 'gray.200'}
        _hover={{ background: 'gray.500' }}
        fontWeight="500"
        fontSize="md"
        px={12}
      >
        2 years
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
