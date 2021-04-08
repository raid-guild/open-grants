import {
  Box,
  Divider,
  Flex,
  HStack,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { Link } from 'components/Link';
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import { getProfile } from 'utils/3box';
import { DataPoint } from 'utils/chart';
import { getVestedAmount } from 'utils/helpers';
import { BoxProfile, Stream } from 'utils/types';

type HintProps = {
  value: DataPoint & { stream: number };
  streams: Array<Stream>;
  isWeeks: boolean;
};

export const ChartHint: React.FC<HintProps> = ({ value, streams, isWeeks }) => {
  const stream =
    value.stream >= 0 && value.stream < streams.length
      ? streams[value.stream]
      : undefined;
  const date = new Date(value.x * 1000);
  const ye = new Intl.DateTimeFormat('en', {
    year: 'numeric',
  }).format(date);
  const mo = new Intl.DateTimeFormat('en', {
    month: 'short',
  }).format(date);
  const da = new Intl.DateTimeFormat('en', {
    day: '2-digit',
  }).format(date);
  const dateString = isWeeks ? `${da} ${mo}` : `${mo} ${ye}`;
  const totalAmount = streams.reduce((t, s) => {
    return t + Number(utils.formatEther(getVestedAmount(s, value.x)));
  }, 0);
  const totalAmountString = `${Math.abs(totalAmount).toFixed(2)} ETH`;

  const streamAmount = stream
    ? `${Math.abs(
        Number(utils.formatEther(getVestedAmount(stream, value.x))),
      ).toFixed(2)} ETH`
    : `0.00 ETH`;
  const h = '9rem !important';
  const w = '10rem !important';
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    if (stream && stream.owner) {
      getProfile(stream.owner).then(p => setProfile(p));
    }
  }, [stream]);

  return (
    <Popover isOpen placement="top-start">
      <PopoverTrigger>
        <Box
          w="1rem"
          h="1rem"
          borderRadius="50%"
          bgColor="green.500"
          transform="translate(1rem,0.5rem)"
          transition="0.25s"
        />
      </PopoverTrigger>
      <PopoverContent
        boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
        border="none"
        maxH={h}
        h={h}
        maxW={w}
        w={w}
        background="#D7FFEF"
        transform="translate(-45%, 0) !important"
        p={2}
      >
        <PopoverArrow background="#D7FFEF" />
        <Flex
          w="100%"
          h="100%"
          py={2}
          justify="center"
          align="center"
          fontFamily="body"
          direction="column"
        >
          <Text
            textTransform="uppercase"
            textAlign="center"
            color="text"
            fontSize="xs"
          >
            {dateString}
          </Text>
          <Text
            fontFamily="Roboto Mono, monospace"
            fontSize="lg"
            textAlign="center"
            color="dark"
          >
            {totalAmountString}
          </Text>
          <Text fontSize="sm" textAlign="center" color="dark" mt={-1}>
            TOTAL
          </Text>
          <Divider color="white" mb={2} mt={1} />
          <Text
            fontFamily="Roboto Mono, monospace"
            fontSize="sm"
            textAlign="center"
            color="dark"
          >
            {streamAmount}
          </Text>
          {stream && stream.owner ? (
            <Link to={`/profile/${stream.owner}`}>
              <HStack spacing={1}>
                <Flex
                  borderRadius="50%"
                  border="1px solid #E6E6E6"
                  w="1.5rem"
                  h="1.5rem"
                  overflow="hidden"
                  background="white"
                  bgImage={profile && `url(${profile.imageUrl})`}
                  bgSize="cover"
                  bgRepeat="no-repeat"
                  bgPosition="center center"
                />
                <Text
                  color="text"
                  fontSize="xs"
                  fontFamily="Roboto Mono, monospace"
                >
                  {profile?.name
                    ? profile.name
                    : `${stream.owner.slice(0, 7).toUpperCase()}...`}
                </Text>
              </HStack>
            </Link>
          ) : (
            <Text fontSize="xs"> Other </Text>
          )}
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
