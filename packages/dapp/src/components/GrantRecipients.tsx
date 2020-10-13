import { Flex, Grid, HStack, Text } from '@chakra-ui/core';
import { GrantRecipient } from 'components/GrantRecipient';
import React from 'react';

type Props = {
  grantees: Array<string>;
  amounts: Array<number>;
};

export const GrantRecipients: React.FC<Props> = ({ grantees, amounts }) => {
  const total = amounts.reduce((t, a) => t + a, 0);
  return (
    <Flex
      w="100%"
      background="white"
      boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
      borderRadius="0.5rem"
      px={12}
      py={8}
      position="relative"
      color="text"
      direction="column"
      align="flex-start"
    >
      <Flex w="100%" justify="space-between" align="center" mb={8}>
        <Text fontWeight="bold" color="black" fontSize="xl">
          Grant Recipients
        </Text>
        <Text>
          {`${grantees.length} ${
            grantees.length === 1 ? 'Recipient' : 'Recipients'
          }`}
        </Text>
      </Flex>
      <Grid w="100%" gap={4} templateColumns="5fr 1fr" color="text">
        <HStack />
        <HStack>
          <Text
            textAlign="center"
            w="100%"
            textTransform="uppercase"
            fontSize="xs"
          >
            Percentage
          </Text>
        </HStack>
      </Grid>
      {grantees.map((grantee, id) => (
        <GrantRecipient
          account={grantee}
          amount={amounts[id]}
          total={total}
          key={grantee}
        />
      ))}
    </Flex>
  );
};
