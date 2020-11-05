import { SimpleGrid, Text, VStack } from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { AmountDisplay } from 'components/AmountDisplay';
import { Link } from 'components/Link';
import React from 'react';
import { formatValue } from 'utils/helpers';
import { Profile } from 'utils/types';

type Props = {
  rank: number;
  profile: Profile;
  loggedInUser: boolean;
};
export const ProfileHeader: React.FC<Props> = ({
  rank,
  profile,
  loggedInUser,
}) => {
  const name = profile.name ? profile.name.split(' ')[0] : 'User';
  return (
    <VStack
      px="2rem"
      w="100%"
      justify="flex-end"
      color="white"
      bgImage={`url(${HeaderBG})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      minH="35rem"
      pt="5rem"
    >
      <Text
        fontSize={{ base: '2rem', md: '3rem' }}
        fontWeight="800"
        textAlign="center"
      >
        {loggedInUser ? `My Grants` : `${name}'s Grants`}
      </Text>
      <Link mb={24} to="/leaderboard">
        {rank > 0 &&
          (loggedInUser
            ? `You rank #${rank} out of all funders`
            : `User ranks #${rank} out of all funders`)}
      </Link>
      <SimpleGrid
        columns={4}
        spacing={4}
        letterSpacing="0.3px"
        justifySelf="flex-end"
        mb={8}
      >
        <a href="#funded">
          <AmountDisplay
            amount={
              profile.grantsFunded
                ? profile.grantsFunded.length.toString()
                : '0'
            }
            label={
              profile.grantsFunded && profile.grantsFunded.length === 1
                ? 'Grant Funded'
                : 'Grants Funded'
            }
          />
        </a>
        <a href="#streams">
          <AmountDisplay
            amount={`${formatValue(
              profile.pledged.add(profile.funded).sub(profile.streamed),
            )} ETH`}
            label="Pledged"
          />
        </a>
        <a href="#received">
          <AmountDisplay
            amount={
              profile.grantsReceived
                ? profile.grantsReceived.length.toString()
                : '0'
            }
            label={
              profile.grantsReceived && profile.grantsReceived.length === 1
                ? 'Grant Received'
                : 'Grants Received'
            }
          />
        </a>
        <a href="#received">
          <AmountDisplay
            amount={`${formatValue(profile.earned)} ETH`}
            label="Earned"
          />
        </a>
      </SimpleGrid>
    </VStack>
  );
};
