import { Flex, Grid, HStack, Text } from '@chakra-ui/core';
import { GrantFunder } from 'components/GrantFunder';
import { Link } from 'components/Link';
import React from 'react';
import { Funder } from 'utils/types';

type Props = {
  grantAddress: string;
  funders: Array<Funder>;
  page?: boolean;
};

export const GrantFunders: React.FC<Props> = ({
  grantAddress,
  funders,
  page = false,
}) => {
  const displayFunders = page ? funders : funders.slice(0, 5);
  return (
    <Flex
      id="funders"
      w="100%"
      maxW="50rem"
      background={page ? 'transparent' : 'white'}
      boxShadow={page ? 'none' : '0px 4px 4px rgba(114, 125, 129, 0.25)'}
      borderRadius={page ? '0' : '0.5rem'}
      p={{ base: '6', md: '8' }}
      position="relative"
      color="text"
      direction="column"
      align="flex-start"
    >
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        mb={4}
        direction={page ? 'column' : 'row'}
      >
        <Text
          color="dark"
          fontSize={page ? { base: '1.5rem', md: '2rem' } : 'xl'}
          fontWeight={page ? '800' : 'bold'}
        >
          Grant Funders
        </Text>
        <Text fontSize="sm">
          {`${funders.length} ${funders.length === 1 ? 'Funder' : 'Funders'}`}
        </Text>
      </Flex>
      <Grid w="100%" gap={4} templateColumns="4fr 1fr 1fr" color="text">
        <HStack />
        <HStack>
          <Text
            textAlign="center"
            w="100%"
            textTransform="uppercase"
            fontSize="xs"
          >
            Pledged
          </Text>
        </HStack>
        <HStack>
          <Text
            textAlign="center"
            w="100%"
            textTransform="uppercase"
            fontSize="xs"
          >
            Paid Out
          </Text>
        </HStack>
      </Grid>
      {displayFunders.length > 0 ? (
        displayFunders.map(funder => (
          <GrantFunder funder={funder} key={funder.id} />
        ))
      ) : (
        <Text
          minW="100%"
          w="100%"
          textAlign="center"
          mt={2}
          p={3}
          background="haze"
        >
          No Funders found
        </Text>
      )}
      {!page && funders.length > 5 && (
        <Flex w="100%" justify="space-between" align="center" mt={4}>
          <Text fontSize="sm">{`+ ${funders.length - 5} more`}</Text>
          <Link
            to={`/grant/${grantAddress}/funders`}
            textDecor="underline"
            color="green.500"
            fontWeight="500"
            fontSize="sm"
          >
            View all funders
          </Link>
        </Flex>
      )}
    </Flex>
  );
};
