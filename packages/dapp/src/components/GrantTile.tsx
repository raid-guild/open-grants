import {
  Button,
  Flex,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import TileBG from 'assets/tile-background.svg';
import { FundGrantModal } from 'components/FundGrantModal';
import { Link, LinkButton } from 'components/Link';
import { ProfileImage } from 'components/ProfileImage';
import { CONFIG } from 'config';
import { Web3Context } from 'contexts/Web3Context';
import React, { useContext } from 'react';
import { formatValue } from 'utils/helpers';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
  myGrant?: boolean;
};

const truncateText = (text: string, maxLength: number): string => {
  let truncated = text;

  if (truncated.length > maxLength - 3) {
    truncated = `${truncated.substr(0, maxLength - 3)}...`;
  }
  return truncated;
};

export const GrantTile: React.FC<Props> = ({ grant, myGrant = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { ethersProvider, isSupportedNetwork } = useContext(Web3Context);
  const toast = useToast();
  if (!grant) return null;
  const displayGrantees = grant.grantees
    ? grant.grantees.slice(0, 4).reverse()
    : [];
  const leftOver = grant.grantees ? grant.grantees.length - 4 : 0;

  const openFundModal = () => {
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
      bgImage={`url(${TileBG})`}
      bgSize="contain"
      bgRepeat="no-repeat"
      bgPosition="center bottom"
    >
      <Flex p={2} flex={1}>
        <Flex direction="column" align="flex-start" flex={1} pr="1rem">
          <Link
            to={`/grant/${grant.id}`}
            color="dark"
            fontWeight="bold"
            fontSize="xl"
            textAlign="left"
            mb={6}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {truncateText(grant.name, 32)}
          </Link>
          <Text fontSize="sm" mb={8}>
            {truncateText(grant.description, 144)}
          </Text>
          <Spacer />
          <SimpleGrid columns={2} spacing={6} mb={6}>
            <Flex direction="column">
              <Text
                fontFamily="'Roboto Mono', monospace"
                color="dark"
                fontSize="2xl"
              >
                {`Ξ${formatValue(grant.pledged)}`}
              </Text>
              <Text textTransform="uppercase" letterSpacing="0.3px">
                Pledged
              </Text>
            </Flex>
            <Flex direction="column">
              <Text
                fontFamily="'Roboto Mono', monospace"
                color="dark"
                fontSize="2xl"
              >
                {`Ξ${formatValue(grant.funded)}`}
              </Text>
              <Text textTransform="uppercase" letterSpacing="0.3px">
                Paid Out
              </Text>
            </Flex>
          </SimpleGrid>
        </Flex>
        <Flex direction="column-reverse" justify="flex-end">
          {leftOver > 0 && (
            <Link to={`/grant/${grant.id}/recipients`}>
              <Flex
                border="1px solid #E6E6E6"
                background="background"
                borderRadius="50%"
                w="2.5rem"
                h="2.5rem"
                mb={-2}
                fontSize="0.75rem"
                justify="center"
                align="center"
                overflow="hidden"
              >
                {`+${leftOver}`}
              </Flex>
            </Link>
          )}
          {displayGrantees.map(a => (
            <ProfileImage account={a} key={a} />
          ))}
        </Flex>
      </Flex>
      {myGrant ? (
        <Button
          colorScheme="green"
          textTransform="uppercase"
          w="100%"
          boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
          onClick={openFundModal}
        >
          Add Funds
        </Button>
      ) : (
        <SimpleGrid columns={2} spacing={4}>
          <LinkButton
            to={`/grant/${grant.id}`}
            bg="background"
            // _hover={{background: 'black20'}}
            textTransform="uppercase"
            w="100%"
            boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
          >
            Details
          </LinkButton>
          <Button
            colorScheme="green"
            textTransform="uppercase"
            w="100%"
            boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
            onClick={openFundModal}
          >
            Fund
          </Button>
        </SimpleGrid>
      )}
      <FundGrantModal
        grantAddress={grant.id}
        isOpen={isOpen}
        onClose={onClose}
      />
    </VStack>
  );
};
