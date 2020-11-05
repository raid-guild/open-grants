import { Flex, Grid, HStack, Text } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { BoxProfile, getProfile } from 'utils/3box';
import { formatValue, getVestedAmount } from 'utils/helpers';
import { Stream } from 'utils/types';

type StreamProps = {
  selected: Array<Stream>;
  setSelected: React.Dispatch<React.SetStateAction<Array<Stream>>>;
  stream: Stream;
};

export const GrantStream: React.FC<StreamProps> = ({
  selected,
  setSelected,
  stream,
}) => {
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const available = getVestedAmount(stream, timestamp).sub(stream.released);

  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    getProfile(stream.owner).then(p => setProfile(p));
  }, [stream.owner]);
  const selectedIndex = selected.indexOf(stream);
  return (
    <Grid
      w="100%"
      gap={4}
      templateColumns="1fr 1fr 4fr"
      color="text"
      background="white"
      boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
      borderRadius="0.5rem"
      p={4}
      cursor="pointer"
      border={selectedIndex !== -1 ? '3px solid #21C49D' : ''}
      onClick={() => {
        const newSelected = selected.slice();
        if (selectedIndex !== -1) {
          newSelected.splice(selectedIndex, 1);
        } else {
          newSelected.push(stream);
        }
        setSelected(newSelected);
      }}
    >
      <HStack w="100%">
        <Text w="100%" fontWeight="bold" textAlign="center">
          {`${formatValue(available, 2)} ETH`}
        </Text>
      </HStack>
      <HStack w="100%">
        <Text w="100%" textAlign="center">
          {`${formatValue(stream.funded, 2)} ETH`}
        </Text>
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
