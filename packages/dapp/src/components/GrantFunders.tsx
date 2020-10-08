import { Flex, Grid, HStack, Text } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { BoxProfile, getProfile } from 'utils/3box';
import { formatValue } from 'utils/helpers';
import { Funder } from 'utils/types';

type Props = {
  funders: Array<Funder>;
};

export const GrantFunders: React.FC<Props> = ({ funders }) => {
  return (
    <Flex
      w="100%"
      background="white"
      boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
      borderRadius="0.5rem"
      px={12}
      py={8}
      position="relative"
      color="text"
      direction="column"
      align="flex-start"
    >
      <Flex w="100%" justify="space-between" align="center" mb={8}>
        <Text fontWeight="bold" color="black" fontSize="xl">
          Grant Funders
        </Text>
        <Text>
          {`${funders.length} ${funders.length === 1 ? 'Funder' : 'Funders'}`}
        </Text>
      </Flex>
      <Grid w="100%" gap={4} templateColumns="4fr 1fr 1fr" color="text">
        <HStack />
        <HStack>
          <Text
            textAlign="center"
            w="100%"
            textTransform="uppercase"
            fontSize="xs"
          >
            Pledged
          </Text>
        </HStack>
        <HStack>
          <Text
            textAlign="center"
            w="100%"
            textTransform="uppercase"
            fontSize="xs"
          >
            Vested
          </Text>
        </HStack>
      </Grid>
      {funders.map(funder => (
        <GrantFunder funder={funder} key={funder.id} />
      ))}
    </Flex>
  );
};

type FunderProps = {
  funder: Funder;
};

const GrantFunder: React.FC<FunderProps> = ({ funder }) => {
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    async function fetchProfile() {
      setProfile(await getProfile(funder.id));
    }
    if (funder) {
      fetchProfile();
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
    >
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
        <Text>
          {profile && profile.name
            ? profile.name
            : `${funder.id.slice(0, 7).toUpperCase()}...`}
        </Text>
      </HStack>
      <HStack>
        <Text textAlign="center" w="100%">{`${formatValue(
          funder.pledged,
        )} ETH`}</Text>
      </HStack>
      <HStack>
        <Text textAlign="center" w="100%">{`${formatValue(
          funder.vested,
        )} ETH`}</Text>
      </HStack>
    </Grid>
  );
};
