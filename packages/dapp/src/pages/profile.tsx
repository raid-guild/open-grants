import { Box, VStack } from '@chakra-ui/core';
import { ProfileContent } from 'components/ProfileContent';
import { ProfileHeader } from 'components/ProfileHeader';
import { Web3Context } from 'contexts/Web3Context';
import { getProfile } from 'graphql/getProfile';
import React, { useContext, useEffect, useState } from 'react';
import { Profile } from 'utils/types';

const ProfilePage: React.FC = () => {
  const { account } = useContext(Web3Context);
  const [profile, setProfile] = useState<Profile | null | undefined>();

  useEffect(() => {
    async function fetchProfile() {
      setProfile(await getProfile(account.toLowerCase()));
    }
    fetchProfile();
  }, [account]);

  if (profile === undefined) {
    return <Box mt="5rem"> Loading ... </Box>;
  }
  if (profile === null) {
    return <Box mt="5rem"> Profile not found </Box>;
  }
  return (
    <VStack w="100%">
      <ProfileHeader profile={profile} />
      <ProfileContent profile={profile} />
    </VStack>
  );
};

export default ProfilePage;
