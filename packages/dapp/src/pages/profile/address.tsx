import { Box, VStack } from '@chakra-ui/react';
import { LoadingPage } from 'components/LoadingPage';
import { ProfileContent } from 'components/ProfileContent';
import { ProfileHeader } from 'components/ProfileHeader';
import { Web3Context } from 'contexts/Web3Context';
import { getProfile } from 'graphql/getProfile';
import { getRank } from 'graphql/getRank';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Profile } from 'utils/types';

interface MatchParams {
  userAddress: string;
}

type Props = RouteComponentProps<MatchParams>;

const ProfilePage: React.FC<Props> = ({
  match: {
    params: { userAddress },
  },
}) => {
  const { account } = useContext(Web3Context);
  const loggedInUser = account.toLowerCase() === userAddress.toLowerCase();
  const [profile, setProfile] = useState<Profile | null | undefined>();
  const [rank, setRank] = useState(-1);

  useEffect(() => {
    getProfile(userAddress).then(p => setProfile(p));
    getRank(userAddress).then(r => setRank(r));
  }, [userAddress]);

  if (profile === undefined) {
    return <LoadingPage />;
  }
  if (profile === null) {
    return <Box mt="5rem"> Profile not found </Box>;
  }
  return (
    <VStack w="100%">
      <ProfileHeader
        profile={profile}
        rank={rank}
        loggedInUser={loggedInUser}
      />
      <ProfileContent profile={profile} loggedInUser={loggedInUser} />
    </VStack>
  );
};

export default ProfilePage;
