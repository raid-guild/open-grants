import { Flex, SimpleGrid, Text, VStack } from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
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
        {loggedInUser ? `My Grants` : `User Grants`}
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
          <Flex
            direction="column"
            h="100%"
            justify="space-between"
            _hover={{ color: 'text' }}
            transition="0.25s"
          >
            <Text fontWeight="500" fontSize="3xl" textAlign="center">
              {profile.grantsFunded ? profile.grantsFunded.length : 0}
            </Text>
            <Text textTransform="uppercase" textAlign="center">
              {profile.grantsFunded && profile.grantsFunded.length === 1
                ? 'Grant Funded'
                : 'Grants Funded'}
            </Text>
          </Flex>
        </a>
        <a href="#streams">
          <Flex
            direction="column"
            h="100%"
            justify="space-between"
            _hover={{ color: 'text' }}
            transition="0.25s"
          >
            <Text fontWeight="500" fontSize="3xl" textAlign="center">
              {`${formatValue(
                profile.pledged.add(profile.funded).sub(profile.streamed),
              )} ETH`}
            </Text>
            <Text textTransform="uppercase" textAlign="center">
              Pledged
            </Text>
          </Flex>
        </a>
        <a href="#received">
          <Flex
            direction="column"
            h="100%"
            justify="space-between"
            _hover={{ color: 'text' }}
            transition="0.25s"
          >
            <Text fontWeight="500" fontSize="3xl" textAlign="center">
              {profile.grantsReceived ? profile.grantsReceived.length : 0}
            </Text>
            <Text textTransform="uppercase" textAlign="center">
              {profile.grantsReceived && profile.grantsReceived.length === 1
                ? 'Grant Received'
                : 'Grants Received'}
            </Text>
          </Flex>
        </a>
        <a href="#received">
          <Flex
            direction="column"
            h="100%"
            justify="space-between"
            _hover={{ color: 'text' }}
            transition="0.25s"
          >
            <Text fontWeight="500" fontSize="3xl" textAlign="center">
              {`${formatValue(profile.earned)} ETH`}
            </Text>
            <Text textTransform="uppercase" textAlign="center">
              Earned
            </Text>
          </Flex>
        </a>
      </SimpleGrid>
    </VStack>
  );
};
