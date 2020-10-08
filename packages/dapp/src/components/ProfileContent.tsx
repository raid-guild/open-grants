import { SimpleGrid, Text, VStack } from '@chakra-ui/core';
import { GrantDetails } from 'components/GrantDetails';
import { GrantTile } from 'components/GrantTile';
import { StreamTile } from 'components/StreamTile';
import React from 'react';
import { Profile } from 'utils/types';

type Props = {
  profile: Profile;
};
export const ProfileContent: React.FC<Props> = ({ profile }) => {
  // eslint-disable-next-line
  console.log({ profile });
  return (
    <VStack w="100%" spacing={8} maxW="70rem" p={8} color="text" mb={16}>
      <Text textTransform="uppercase" fontSize="xl" w="100%">
        Grants I’m a recipient of
      </Text>
      {profile.myGrants.map(grant => (
        <GrantDetails grant={grant} myGrant key={grant.id} />
      ))}
      <Text textTransform="uppercase" fontSize="xl" w="100%" pt={4}>
        Active Streams
      </Text>
      <SimpleGrid columns={[1, null, 2, 3]} spacing={8} w="100%">
        {profile.streams
          .filter(s => !s.isRevoked && s.grantName)
          .map(stream => (
            <StreamTile stream={stream} key={stream.startTime} />
          ))}
      </SimpleGrid>
      <Text textTransform="uppercase" fontSize="xl" w="100%" pt={4}>
        Grants I’ve funded
      </Text>
      <SimpleGrid columns={[1, null, 2, 3]} spacing={8} w="100%">
        {profile.fundedGrants.map(grant => (
          <GrantTile grant={grant} myGrant key={grant.id} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};
