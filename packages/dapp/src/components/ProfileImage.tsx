import { Flex } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BoxProfile, getProfile } from 'utils/3box';

type Props = {
  account: string;
};

export const ProfileImage: React.FC<Props> = ({ account }) => {
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    if (account) {
      getProfile(account).then(p => setProfile(p));
    }
  }, [account]);
  return (
    <Link to={`/profile/${account}`}>
      <Flex
        borderRadius="50%"
        border="1px solid #E6E6E6"
        w="2.5rem"
        h="2.5rem"
        mb={-2}
        overflow="hidden"
        background="white"
        bgImage={profile && `url(${profile.imageUrl})`}
        bgSize="cover"
        bgRepeat="no-repeat"
        bgPosition="center center"
      />
    </Link>
  );
};
