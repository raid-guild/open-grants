import { Flex, Grid, HStack, Text } from '@chakra-ui/react';
import { Link } from 'components/Link';
import React, { useEffect, useState } from 'react';
import { BoxProfile, getProfile } from 'utils/3box';
import { formatValue } from 'utils/helpers';
import { Funder } from 'utils/types';

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
          <Text fontFamily="Roboto Mono, monospace">
            {profile && profile.name
              ? profile.name
              : `${funder.id.slice(0, 7).toUpperCase()}...`}
          </Text>
        </HStack>
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
