import { Grid, HStack, Text, VStack } from '@chakra-ui/react';
import { Leader } from 'components/Leader';
import { LoadingPage } from 'components/LoadingPage';
import { getLeaders } from 'graphql/getLeaders';
import React, { useEffect, useState } from 'react';
import { User } from 'utils/types';

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLeaders().then(result => {
      setUsers(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingPage />;
  }
  return (
    <VStack
      w="100%"
      spacing={8}
      maxW="50rem"
      py="4rem"
      align="stretch"
      px={8}
      color="text"
    >
      <Text
        textAlign="center"
        fontSize={{ base: '2rem', md: '3rem' }}
        fontWeight="800"
        color="dark"
      >
        Leaderboard
      </Text>
      <Grid w="100%" gap={4} templateColumns="2fr 8fr 2fr 2fr" color="text">
        <HStack>
          <Text
            textAlign="center"
            w="100%"
            textTransform="uppercase"
            fontSize="xs"
          >
            Rank
          </Text>
        </HStack>
        <HStack>
          <Text pl="3.5rem" w="100%" textTransform="uppercase" fontSize="xs">
            User
          </Text>
        </HStack>
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
      {users && users.length > 0 ? (
        users.map((user, id) => (
          <Leader rank={id + 1} user={user} key={user.id} />
        ))
      ) : (
        <Text w="100%" textAlign="center" mt={8}>
          No Leaders found
        </Text>
      )}
    </VStack>
  );
};
