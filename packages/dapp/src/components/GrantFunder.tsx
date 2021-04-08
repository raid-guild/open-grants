import {
  Flex,
  Grid,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { Link } from 'components/Link';
import React, { useEffect, useState } from 'react';
import { getProfile } from 'utils/3box';
import { formatValue, getDisplayAddress, getDisplayName } from 'utils/helpers';
import { BoxProfile, Funder } from 'utils/types';

type FunderProps = {
  funder: Funder;
};

export const GrantFunder: React.FC<FunderProps> = ({ funder }) => {
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    if (funder) {
      getProfile(funder.id).then(p => setProfile(p));
    }
  }, [funder]);

  const displayName = getDisplayName(profile, funder.id);
  return (
    <Grid
      w="100%"
      gap={4}
      templateColumns="4fr 1fr 1fr"
      color="dark"
      borderBottom="1px solid #EAECEF"
      minH="3rem"
      padding=".5rem 0 .5rem 0"
    >
      <Link to={`/profile/${funder.id}`}>
        <Popover trigger="hover" placement="top-start">
          <PopoverTrigger>
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
              <Text fontFamily="Roboto Mono, monospace">{displayName}</Text>
            </HStack>
          </PopoverTrigger>
          <PopoverContent
            boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
            border="none"
            background="#D7FFEF"
            transform="translate(50%, 0)"
            p={2}
          >
            <Flex
              w="100%"
              h="100%"
              justify="center"
              align="stretch"
              fontFamily="body"
              direction="column"
            >
              <Text fontWeight="bold" fontFamily="Roboto Mono, monospace">
                {getDisplayAddress(funder.id, 28)}
              </Text>
              {profile?.name && <Text>{profile.name}</Text>}
            </Flex>
          </PopoverContent>
        </Popover>
      </Link>
      <HStack>
        <Text textAlign="center" w="100%" fontFamily="Roboto Mono, monospace">
          {`Ξ${formatValue(funder.pledged.sub(funder.withdrawn))}`}
        </Text>
      </HStack>
      <HStack>
        <Text textAlign="center" w="100%" fontFamily="Roboto Mono, monospace">
          {`Ξ${formatValue(funder.funded)}`}
        </Text>
      </HStack>
    </Grid>
  );
};
