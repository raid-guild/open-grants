import { Flex, Grid, HStack, Text } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { BoxProfile,getProfile } from 'utils/3box';

type Props = {
  grantees: Array<string>;
  amounts: Array<number>;
};

export const GrantRecipients: React.FC<Props> = ({ grantees, amounts }) => {
  const total = amounts.reduce((t, a) => t + a, 0);
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
          Grant Recipients
        </Text>
        <Text>
          {`${grantees.length} ${
            grantees.length === 1 ? 'Recipient' : 'Recipients'
          }`}
        </Text>
      </Flex>
      <Grid w="100%" gap={4} templateColumns="5fr 1fr" color="text">
        <HStack />
        <HStack>
          <Text
            textAlign="center"
            w="100%"
            textTransform="uppercase"
            fontSize="xs"
          >
            Percentage
          </Text>
        </HStack>
      </Grid>
      {grantees.map((grantee, id) => (
        <GrantRecipient
          account={grantee}
          amount={amounts[id]}
          total={total}
          key={grantee}
        />
      ))}
    </Flex>
  );
};

type RecipientProps = {
  account: string;
  amount: number;
  total: number;
};

const GrantRecipient: React.FC<RecipientProps> = ({
  account,
  amount,
  total,
}) => {
  const percent = ((amount * 100) / total).toFixed(1);
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    async function fetchProfile() {
      setProfile(await getProfile(account));
    }
    if (account) {
      fetchProfile();
    }
  }, [account]);
  return (
    <Grid
      w="100%"
      gap={4}
      templateColumns="5fr 1fr"
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
            : `${account.slice(0, 7).toUpperCase()}...`}
        </Text>
      </HStack>
      <HStack>
        <Text textAlign="center" w="100%">{`${percent}%`}</Text>
      </HStack>
    </Grid>
  );
};
