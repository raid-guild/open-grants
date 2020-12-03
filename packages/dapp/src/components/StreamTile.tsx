import {
  Button,
  Flex,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/core';
import { Link } from 'components/Link';
import { StopStreamModal } from 'components/StopStreamModal';
import { CONFIG } from 'config';
import { Web3Context } from 'contexts/Web3Context';
import React, { useContext } from 'react';
import { formatValue, getVestedAmount } from 'utils/helpers';
import { Stream } from 'utils/types';

type Props = {
  stream: Stream;
};
export const StreamTile: React.FC<Props> = ({ stream }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, ethersProvider, isSupportedNetwork } = useContext(
    Web3Context,
  );
  const toast = useToast();
  if (!stream) return null;
  const currentTime = Math.ceil(new Date().getTime() / 1000);
  const vested = getVestedAmount(stream, currentTime);
  const myStream = account.toLowerCase() === stream.owner.toLowerCase();

  const openStreamModal = () => {
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
      onOpen();
    }
  };
  return (
    <VStack
      style={{ backdropFilter: 'blur(7px)' }}
      rounded="lg"
      p={4}
      background="white"
      boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
      color="gray.500"
      align="stretch"
    >
      <Flex direction="column" align="flex-start" p={2}>
        <Link
          to={`/grant/${stream.grantAddress}`}
          color="dark"
          fontWeight="bold"
          fontSize="xl"
          mb={6}
        >
          {stream.grantName}
        </Link>
        <SimpleGrid columns={2} spacing={4} mb={16} letterSpacing="0.3px">
          <Flex direction="column">
            <Text
              fontFamily="Roboto Mono, monospace"
              color="dark"
              fontSize="2xl"
            >
              {`Ξ${formatValue(stream.funded)}`}
            </Text>
            <Text textTransform="uppercase">Pledged</Text>
            <Text fontSize="xs" mt={4}>{`Start ${new Date(
              stream.startTime * 1000,
            ).toLocaleDateString()}`}</Text>
          </Flex>
          <Flex direction="column">
            <Text
              fontFamily="Roboto Mono, monospace"
              color="dark"
              fontSize="2xl"
            >
              {`Ξ${formatValue(vested)}`}
            </Text>
            <Text textTransform="uppercase">Vested</Text>
            <Text fontSize="xs" mt={4}>{`End ${new Date(
              (stream.startTime + stream.duration) * 1000,
            ).toLocaleDateString()}`}</Text>
          </Flex>
        </SimpleGrid>
      </Flex>
      {myStream && (
        <Button
          bg="background"
          textTransform="uppercase"
          w="100%"
          boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
          onClick={openStreamModal}
        >
          Stop the stream
        </Button>
      )}
      <StopStreamModal stream={stream} isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
};
