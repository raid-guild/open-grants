import { Flex } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { getProfile, Profile } from 'utils/3box';

type Props = {
  account: string;
};

export const ProfileImage: React.FC<Props> = ({ account }) => {
  const [profile, setProfile] = useState<Profile | undefined>();
  useEffect(() => {
    async function fetchProfile() {
      setProfile(await getProfile(account));
    }
    if (account) {
      fetchProfile();
    }
  }, [account]);
  return (
    <Flex
      background="background"
      borderRadius="50%"
      border="1px solid #E6E6E6"
      w="2.5rem"
      h="2.5rem"
      mb={-2}
      overflow="hidden"
      bgImage={profile && `url(${profile.imageUrl})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center center"
    />
  );
};
