import { Flex, Grid, HStack, Image, Text } from '@chakra-ui/core';
import DoneSVG from 'assets/done.svg';
import LoadingSVG from 'assets/loading.svg';
import { Link } from 'components/Link';
import { CONFIG } from 'config';
import { providers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { BoxProfile, getProfile } from 'utils/3box';
import { formatValue, getVestedAmount } from 'utils/helpers';
import { Stream } from 'utils/types';

type StreamProps = {
  stream: Stream;
  tx: providers.TransactionResponse;
};

export const InProgressStream: React.FC<StreamProps> = ({ stream, tx }) => {
  const timestamp = tx.timestamp
    ? tx.timestamp
    : Math.floor(new Date().getTime() / 1000);
  const available = getVestedAmount(stream, timestamp);
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getProfile(stream.owner).then(p => setProfile(p));
  }, [stream.owner]);
  useEffect(() => {
    tx.wait().then(() => setLoading(false));
  }, [tx]);
  return (
    <Grid
      w="100%"
      gap={4}
      templateColumns="1fr 2fr 4fr 6fr"
      color="text"
      background="white"
      boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
      borderRadius="0.5rem"
      p={4}
    >
      <Flex w="100%" justify="center" align="center">
        {loading ? (
          <Image src={LoadingSVG} alt="loading" w="1.5rem" />
        ) : (
          <Image src={DoneSVG} alt="done" w="1.5rem" />
        )}
      </Flex>
      <HStack w="100%">
        <Text w="100%" fontWeight="bold" textAlign="center">
          {`${formatValue(available, 2)} ETH`}
        </Text>
      </HStack>
      <HStack w="100%">
        <Link
          isExternal
          textDecoration="underline"
          to={`${CONFIG.explorerEndpoint}/tx/${tx.hash}`}
        >
          View on Etherscan
        </Link>
      </HStack>
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
            : `${stream.owner.slice(0, 7).toUpperCase()}...`}
        </Text>
      </HStack>
    </Grid>
  );
};
