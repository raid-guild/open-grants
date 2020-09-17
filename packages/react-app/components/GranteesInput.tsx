import {
  VStack,
  Flex,
  Text,
  Link,
  Input,
  InputGroup,
  InputRightElement,
  Grid,
} from '@chakra-ui/core';
import React from 'react';

type Props = {
  total: number;
  grantees: Array<string>;
  setGrantees: React.Dispatch<React.SetStateAction<Array<string>>>;
  amounts: Array<string>;
  setAmounts: React.Dispatch<React.SetStateAction<Array<string>>>;
};

export const GranteesInput: React.FC<Props> = ({
  total,
  grantees,
  setGrantees,
  amounts,
  setAmounts,
}) => {
  console.log({ total, grantees, amounts });

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
        <Link color="green.500" fontWeight="500">
          Distribute Evenly
        </Link>
      </Flex>
      <VStack spacing={4} w="100%">
        {Array(total)
          .fill(0)
          .map((v, i) => (
            <Grid
              w="100%"
              templateColumns="3fr 1fr"
              gridGap={4}
              key={v.toString() + i.toString()}
            >
              <Input
                size="lg"
                border="none"
                value={grantees[i]}
                placeholder="Grantee Address"
                onChange={e => {
                  let newGrantees = grantees.slice();
                  newGrantees[i] = e.target.value;
                  setGrantees(newGrantees);
                }}
                fontSize="md"
                maxLength={42}
              />
              <InputGroup size="lg">
                <Input
                  border="none"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Percentage"
                  fontSize="md"
                  value={amounts[i]}
                  onChange={e => {
                    let newAmounts = amounts.slice();
                    newAmounts[i] = e.target.value;
                    setAmounts(newAmounts);
                  }}
                />
                <InputRightElement
                  pointerEvents="none"
                  color="green.500"
                  children="%"
                  fontSize="md"
                />
              </InputGroup>
            </Grid>
          ))}
      </VStack>
    </Flex>
  );
};
