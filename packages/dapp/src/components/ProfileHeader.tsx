import {
  Button,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import HeaderBG from 'assets/header.jpg';
import { AmountDisplay } from 'components/AmountDisplay';
import { Link } from 'components/Link';
import { CONFIG } from 'config';
import { CopyIcon } from 'icons/CopyIcon';
import React, { useEffect, useState } from 'react';
import { BoxProfile, getProfile } from 'utils/3box';
import { copyToClipboard, formatValue } from 'utils/helpers';
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
  const addressDisplay = useBreakpointValue({
    base: `${profile.id.slice(0, 12).toUpperCase()}...`,
    sm: `${profile.id.slice(0, 24).toUpperCase()}...`,
    md: profile.id,
  });
  const [boxProfile, setBoxProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    getProfile(profile.id).then(p => setBoxProfile(p));
  }, [profile]);

  const name = boxProfile && boxProfile.name ? boxProfile.name : 'User';
  return (
    <VStack
      px={{ base: '1rem', sm: '2rem' }}
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
      <Link to="/leaderboard" mb={2}>
        {rank > 0 &&
          (loggedInUser
            ? `You rank #${rank} out of all funders`
            : `User ranks #${rank} out of all funders`)}
      </Link>
      <Divider w="2rem" borderWidth="2px" mb={2} />
      <Flex mb={6} align="center" fontFamily="Roboto Mono, monospace">
        <Link
          to={`${CONFIG.explorerEndpoint}/address/${profile.id}`}
          textTransform="uppercase"
          isExternal
          fontSize={{ base: '.8rem', sm: '1rem' }}
        >
          {addressDisplay}
        </Link>
        {document.queryCommandSupported('copy') && (
          <Button
            ml={4}
            onClick={() => copyToClipboard(profile.id.toLowerCase())}
            variant="ghost"
            color="white"
            _hover={{ background: 'black20' }}
            h="auto"
            w="auto"
            minW="2"
            p={2}
          >
            <CopyIcon boxSize={4} />
          </Button>
        )}
      </Flex>
      <VStack h={8} />
      <SimpleGrid
        columns={4}
        spacing={4}
        letterSpacing="0.3px"
        justifySelf="flex-end"
        mb={8}
        fontFamily="Roboto Mono, monospace"
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
            amount={`Ξ${formatValue(
              profile.pledged
                .add(profile.funded)
                .sub(profile.streamed)
                .sub(profile.withdrawn),
            )}`}
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
            amount={`Ξ${formatValue(profile.earned)}`}
            label="Earned"
          />
        </a>
      </SimpleGrid>
    </VStack>
  );
};
