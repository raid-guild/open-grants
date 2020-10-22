import {
  Button,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/core';
import { utils } from 'ethers';
import { CloseIcon } from 'icons/CloseIcon';
import React, { useState } from 'react';

type Props = {
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  grantees: Array<string>;
  setGrantees: React.Dispatch<React.SetStateAction<Array<string>>>;
  amounts: Array<string>;
  setAmounts: React.Dispatch<React.SetStateAction<Array<string>>>;
};

export const GranteesInput: React.FC<Props> = ({
  total,
  setTotal,
  grantees,
  setGrantees,
  amounts,
  setAmounts,
}) => {
  const distributeEvenly = () => {
    const even = Math.floor(1000 / total);
    const newAmounts = new Array(total).fill((even / 10.0).toFixed(1));
    newAmounts[total - 1] = (100.0 - (even / 10.0) * (total - 1)).toFixed(1);
    setAmounts(newAmounts);
  };
  const removeGrantee = (index: number) => {
    setTotal(t => t - 1);
    const newGrantees = grantees.slice();
    newGrantees.splice(index, 1);
    setGrantees(newGrantees);
    const newAmounts = amounts.slice();
    newAmounts.splice(index, 1);
    setAmounts(newAmounts);
  };
  return (
    <Flex direction="column" w="100%">
      <Flex
        justify="space-between"
        align="center"
        fontSize="sm"
        w="100%"
        p={1}
        mb={2}
      >
        <Text>Who will be the recipients of this grant?</Text>
        <Button
          variant="link"
          color="green.500"
          fontWeight="500"
          fontSize="sm"
          textAlign="right"
          whiteSpace="normal"
          onClick={distributeEvenly}
        >
          Distribute Evenly
        </Button>
      </Flex>
      <VStack spacing={4} w="100%">
        {Array(total)
          .fill(0)
          .map((v, i) => (
            <GranteeInput
              key={v.toString() + i.toString()}
              grantees={grantees}
              setGrantees={setGrantees}
              amounts={amounts}
              setAmounts={setAmounts}
              removeGrantee={removeGrantee}
              index={i}
            />
          ))}
      </VStack>
    </Flex>
  );
};

type InputProps = {
  grantees: Array<string>;
  setGrantees: React.Dispatch<React.SetStateAction<Array<string>>>;
  amounts: Array<string>;
  setAmounts: React.Dispatch<React.SetStateAction<Array<string>>>;
  removeGrantee: (index: number) => void;
  index: number;
};

const GranteeInput: React.FC<InputProps> = ({
  grantees,
  setGrantees,
  amounts,
  setAmounts,
  removeGrantee,
  index: i,
}) => {
  const [addressInvalid, setAddressInvalid] = useState(false);
  return (
    <Grid w="100%" templateColumns="3fr 1fr" gridGap={4} position="relative">
      <Input
        color="dark"
        size="lg"
        border="none"
        boxShadow="0px 0px 4px #e2e6ee"
        value={grantees[i]}
        placeholder="Grantee Address"
        isInvalid={addressInvalid}
        onChange={e => {
          setAddressInvalid(!utils.isAddress(e.target.value));
          const newGrantees = grantees.slice();
          newGrantees[i] = e.target.value;
          setGrantees(newGrantees);
        }}
        fontSize="md"
        maxLength={42}
      />
      <InputGroup size="lg">
        <Input
          color="dark"
          border="none"
          type="number"
          min={0}
          max={100}
          placeholder="Percentage"
          fontSize="md"
          boxShadow="0px 0px 4px #e2e6ee"
          value={amounts[i]}
          onChange={e => {
            const newAmounts = amounts.slice();
            newAmounts[i] = e.target.value;
            setAmounts(newAmounts);
          }}
        />
        <InputRightElement
          pointerEvents="none"
          zIndex="initial"
          color="green.500"
          fontSize="md"
        >
          %
        </InputRightElement>
      </InputGroup>
      {i > 0 && (
        <CloseIcon
          position="absolute"
          right="-2rem"
          top="50%"
          transform="translateY(-50%)"
          cursor="pointer"
          transition="0.25s"
          color="text"
          _hover={{ color: 'green.500' }}
          boxSize="1.25rem"
          onClick={() => removeGrantee(i)}
        />
      )}
    </Grid>
  );
};
