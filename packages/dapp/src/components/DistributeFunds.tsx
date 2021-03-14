import {
  Button,
  Divider,
  Flex,
  Grid,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { GrantStream } from 'components/GrantStream';
import { InProgressStream } from 'components/InProgressStream';
import { Link } from 'components/Link';
import { CONFIG } from 'config';
import { Web3Context } from 'contexts/Web3Context';
import { BigNumber, providers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { formatValue, getVestedAmount } from 'utils/helpers';
import { releaseStream } from 'utils/streams';
import { Grant, Stream } from 'utils/types';

type Props = {
  grant: Grant;
};

type ProgressStream = {
  stream: Stream;
  tx: providers.TransactionResponse;
};

export const DistributeFunds: React.FC<Props> = ({ grant }) => {
  const { ethersProvider, isSupportedNetwork } = useContext(Web3Context);
  const toast = useToast();
  const [selected, setSelected] = useState<Array<Stream>>([]);
  const [inProgress, setInProgress] = useState<Array<ProgressStream>>([]);
  const [streams, setStreams] = useState<Array<Stream>>(grant.streams);
  const [selectedAmount, setSelectedAmount] = useState<BigNumber>(
    BigNumber.from(0),
  );

  useEffect(() => {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    setSelectedAmount(
      selected.reduce(
        (t, s) => t.add(getVestedAmount(s, timestamp).sub(s.released)),
        BigNumber.from(0),
      ),
    );
  }, [selected, setSelectedAmount]);

  const processStream = async (
    stream: Stream,
  ): Promise<ProgressStream | undefined> => {
    if (!ethersProvider) return undefined;
    const processedStream = {
      stream,
      tx: await releaseStream(ethersProvider, stream.id),
    };
    setSelected(s => {
      const newSelected = s.slice();
      newSelected.splice(s.indexOf(stream), 1);
      return newSelected;
    });
    setStreams(s => {
      const newStreams = s.slice();
      newStreams.splice(streams.indexOf(stream), 1);
      return newStreams;
    });
    setInProgress(p => {
      const newProgress = p.slice();
      newProgress.push(processedStream);
      return newProgress;
    });
    return processedStream;
  };
  const onSubmit = () => {
    if (!ethersProvider) {
      toast({
        status: 'error',
        isClosable: true,
        title: 'Error',
        description: 'Please connect wallet',
      });
    } else if (!isSupportedNetwork) {
      toast({
        status: 'error',
        isClosable: true,
        title: 'Error',
        description: `Please connect wallet to ${CONFIG.network.name}`,
      });
    } else {
      selected.map(processStream);
    }
  };
  return (
    <VStack w="100%" spacing={6} maxW="50rem" p={8} color="text" mb={16}>
      <Text
        fontSize={{ base: '1.5rem', md: '2rem' }}
        fontWeight="800"
        color="dark"
      >
        Distribute Funds
      </Text>
      <Text mb={6} w="100%">
        Select funds to be released to grant recipients. Each stream requires a
        separate transaction. It is recommended to only release those with an
        available balance above and beyond gas cost.{' '}
        <Link
          to="/faq"
          textDecor="underline"
          _hover={{ color: 'green.500' }}
          isExternal
        >
          Learn how distributions work
        </Link>
      </Text>
      <Text fontWeight="bold" fontSize="lg" w="100%">
        Select Streams to Release:
      </Text>
      <Divider color="haze" />
      <Grid w="100%" gap={4} templateColumns="1fr 1fr 4fr" color="text" px={4}>
        <Text
          textAlign="center"
          w="100%"
          textTransform="uppercase"
          fontSize="sm"
        >
          Available
        </Text>
        <Text
          textAlign="center"
          w="100%"
          textTransform="uppercase"
          fontSize="sm"
        >
          Pledged
        </Text>
        <Flex justify="space-between" w="100%">
          <Text textTransform="uppercase" fontSize="sm">
            Funded By
          </Text>
          <Button
            variant="link"
            color="green.500"
            fontWeight="500"
            fontSize="sm"
            onClick={() => {
              if (selected.length !== 0 && selected.length === streams.length) {
                setSelected([]);
              } else {
                setSelected(streams.slice());
              }
            }}
          >
            {selected.length !== 0 && selected.length === streams.length
              ? 'Unselect All'
              : 'Select All'}
          </Button>
        </Flex>
      </Grid>
      {streams.length > 0 ? (
        <VStack w="100%" spacing={4} fontFamily="Roboto Mono, monospace">
          {streams
            .sort((a, b) => {
              const timestamp = Math.floor(new Date().getTime() / 1000);
              const availableA = getVestedAmount(a, timestamp).sub(a.released);
              const availableB = getVestedAmount(b, timestamp).sub(b.released);
              if (availableA.lt(availableB)) return 1;
              if (availableA.eq(availableB)) return 0;
              return -1;
            })
            .map(stream => (
              <GrantStream
                selected={selected}
                setSelected={setSelected}
                stream={stream}
                key={stream.id}
              />
            ))}
        </VStack>
      ) : (
        <Text> No streams found </Text>
      )}

      <Button
        size="lg"
        colorScheme="green"
        textTransform="uppercase"
        w="100%"
        boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
        letterSpacing="0.115em"
        onClick={onSubmit}
        isDisabled={selected.length === 0}
        py={8}
      >
        {selected.length === 0
          ? 'Distribute Funds'
          : `Distribute ${formatValue(selectedAmount, 2)} ETH`}
      </Button>
      {selected.length > 1 && (
        <Text> {`${selected.length} transactions will be required`} </Text>
      )}
      {inProgress.length > 0 && (
        <VStack w="100%" spacing={4}>
          {inProgress.map(stream => (
            <InProgressStream
              tx={stream.tx}
              stream={stream.stream}
              key={stream.stream.id}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};
