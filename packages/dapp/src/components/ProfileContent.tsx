import { SimpleGrid, Text, VStack } from '@chakra-ui/core';
import { GrantDetails } from 'components/GrantDetails';
import { GrantTile } from 'components/GrantTile';
import { StreamTile } from 'components/StreamTile';
import React from 'react';
import { Profile } from 'utils/types';

type Props = {
  profile: Profile;
  loggedInUser: boolean;
};
export const ProfileContent: React.FC<Props> = ({ profile, loggedInUser }) => {
  const streams = profile.streams.filter(s => !s.isRevoked && s.grantName);

  return (
    <VStack w="100%" spacing={8} maxW="70rem" p={8} color="text" mb={16}>
      <Text textTransform="uppercase" fontSize="xl" w="100%" id="received">
        {loggedInUser ? `Grants I’m a recipient of` : `User is a recipient of`}
      </Text>
      {profile.grantsReceived.length > 0 ? (
        profile.grantsReceived.map(grant => (
          <GrantDetails
            grant={grant}
            myGrant={loggedInUser}
            showName
            key={grant.id}
          />
        ))
      ) : (
        <Text> No Grants found </Text>
      )}
      <Text
        textTransform="uppercase"
        fontSize="xl"
        w="100%"
        pt={4}
        id="streams"
      >
        Active Streams
      </Text>
      {streams.length > 0 ? (
        <SimpleGrid columns={[1, null, 2, 3]} spacing={8} w="100%">
          {streams.map(stream => (
            <StreamTile stream={stream} key={stream.startTime} />
          ))}
        </SimpleGrid>
      ) : (
        <Text> No Streams found </Text>
      )}
      <Text textTransform="uppercase" fontSize="xl" w="100%" pt={4} id="funded">
        {loggedInUser ? `Grants I’ve funded` : `User has funded`}
      </Text>
      {profile.grantsFunded.length > 0 ? (
        <SimpleGrid columns={[1, null, 2, 3]} spacing={8} w="100%">
          {profile.grantsFunded.map(grant => (
            <GrantTile grant={grant} myGrant={loggedInUser} key={grant.id} />
          ))}
        </SimpleGrid>
      ) : (
        <Text> No Grants found </Text>
      )}
    </VStack>
  );
};
