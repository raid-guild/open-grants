import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ONEMONTH, ONEYEAR } from 'utils/constants';

type Props = {
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
};
export const DurationSelector: React.FC<Props> = ({
  duration,
  setDuration,
}) => {
  const [custom, setCustom] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  return (
    <>
      <SimpleGrid columns={{ base: 2, sm: 4 }} position="relative">
        <Button
          variant="solid"
          borderRadius={{ base: '4px 0 0 0', sm: '4px 0 0 4px' }}
          color="white"
          size="lg"
          onClick={() => {
            setCustom(false);
            setDuration(6 * ONEMONTH);
          }}
          background={
            duration === 6 * ONEMONTH && !custom ? 'gray.400' : 'gray.200'
          }
          _hover={{ background: 'gray.500' }}
          fontWeight="500"
          fontSize="md"
          px={{ base: 4, sm: 8 }}
        >
          6 months
        </Button>
        <Button
          variant="solid"
          borderRadius={{ base: '0 4px 0 0', sm: '0' }}
          color="white"
          size="lg"
          onClick={() => {
            setCustom(false);
            setDuration(ONEYEAR);
          }}
          background={duration === ONEYEAR && !custom ? 'gray.400' : 'gray.200'}
          _hover={{ background: 'gray.500' }}
          fontWeight="500"
          fontSize="md"
          px={{ base: 4, sm: 8 }}
        >
          1 year
        </Button>
        <Button
          variant="solid"
          borderRadius={{ base: '0 0 0 4px', sm: '0' }}
          color="white"
          size="lg"
          onClick={() => {
            setCustom(false);
            setDuration(ONEYEAR * 2);
          }}
          background={
            duration === ONEYEAR * 2 && !custom ? 'gray.400' : 'gray.200'
          }
          _hover={{ background: 'gray.500' }}
          fontWeight="500"
          fontSize="md"
          px={{ base: 4, sm: 8 }}
        >
          2 years
        </Button>
        <Button
          variant="solid"
          borderRadius={{ base: '0 0 4px 0', sm: '0 4px 4px 0' }}
          color="white"
          size="lg"
          onClick={() => {
            setCustom(true);
            setDuration(0);
          }}
          background={custom ? 'gray.400' : 'gray.200'}
          _hover={{ background: 'gray.500' }}
          fontWeight="500"
          fontSize="md"
          px={{ base: 4, sm: 8 }}
        >
          Custom
        </Button>
      </SimpleGrid>
      {custom && (
        <InputGroup
          maxW="12rem"
          size="lg"
          color="dark"
          background="white"
          borderRadius="full"
          variant="solid"
          boxShadow="0px 0px 4px #e2e6ee"
        >
          <InputLeftElement mx={1} pointerEvents="none" fontFamily="sans-serif">
            #
          </InputLeftElement>
          <Input
            background="transparent"
            mx={2}
            fontSize="md"
            pl="4rem"
            pr="5rem"
            type="number"
            value={input}
            onChange={e => {
              setInput(e.target.value);
              setDuration(Number(e.target.value) * ONEMONTH);
            }}
          />
          <InputRightElement
            mx={4}
            pointerEvents="none"
            color="green.500"
            fontSize="sm"
            fontWeight="bold"
          >
            Months
          </InputRightElement>
        </InputGroup>
      )}
    </>
  );
};
