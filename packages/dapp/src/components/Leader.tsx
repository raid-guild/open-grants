import { Flex, Grid, HStack, Text } from '@chakra-ui/core';
import { Link } from 'components/Link';
import React, { useEffect, useState } from 'react';
import { BoxProfile, getProfile } from 'utils/3box';
import { formatValue } from 'utils/helpers';
import { User } from 'utils/types';

type LeaderProps = {
  rank: number;
  user: User;
};

export const Leader: React.FC<LeaderProps> = ({ rank, user }) => {
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    if (user) {
      getProfile(user.id).then(p => setProfile(p));
    }
  }, [user]);
  return (
    <Grid
      w="100%"
      gap={4}
      templateColumns="2fr 8fr 2fr 2fr"
      color="dark"
      borderBottom="1px solid #EAECEF"
      minH="3rem"
    >
      <HStack>
        <Text textAlign="center" w="100%" fontWeight="bold">
          {`${rank}.`}
        </Text>
      </HStack>
      <Link to={`/profile/${user.id}`} fontFamily="Roboto Mono, monospace">
        <HStack spacing={4}>
          <Flex
            borderRadius="50%"
            border="1px solid #E6E6E6"
            w="2.5rem"
            h="2.5rem"
            overflow="hidden"
            background="white"
            bgImage={profile && `url(${profile.imageUrl})`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgPosition="center center"
          />
          <Text>
            {profile && profile.name
              ? profile.name
              : `${user.id.slice(0, 7).toUpperCase()}...`}
          </Text>
        </HStack>
      </Link>
      <HStack>
        <Text textAlign="center" w="100%" fontFamily="Roboto Mono, monospace">
          {`Ξ${formatValue(user.pledged.sub(user.withdrawn))}`}
        </Text>
      </HStack>
      <HStack>
        <Text textAlign="center" w="100%" fontFamily="Roboto Mono, monospace">
          {`Ξ${formatValue(user.funded)}`}
        </Text>
      </HStack>
    </Grid>
  );
};
