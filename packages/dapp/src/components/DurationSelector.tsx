import { Button, ButtonGroup } from '@chakra-ui/core';
import { QuestionIcon } from 'icons/QuestionIcon';
import React from 'react';
import { ONEYEAR } from 'utils/constants';

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
        onClick={() => setDuration(ONEYEAR / 2)}
        background={duration === ONEYEAR / 2 ? 'gray.400' : 'gray.200'}
        _hover={{ background: 'gray.500' }}
        fontWeight="500"
        fontSize="md"
        px={{ base: 4, sm: 8, md: 12 }}
      >
        6 months
      </Button>
      <Button
        onClick={() => setDuration(ONEYEAR)}
        background={duration === ONEYEAR ? 'gray.400' : 'gray.200'}
        _hover={{ background: 'gray.500' }}
        fontWeight="500"
        fontSize="md"
        px={{ base: 4, sm: 8, md: 12 }}
      >
        1 year
      </Button>
      <Button
        onClick={() => setDuration(ONEYEAR * 2)}
        background={duration === ONEYEAR * 2 ? 'gray.400' : 'gray.200'}
        _hover={{ background: 'gray.500' }}
        fontWeight="500"
        fontSize="md"
        px={{ base: 4, sm: 8, md: 12 }}
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
