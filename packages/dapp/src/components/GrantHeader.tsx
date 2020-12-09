import {
  Button,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { AmountDisplay } from 'components/AmountDisplay';
import { FundGrantModal } from 'components/FundGrantModal';
import { Link } from 'components/Link';
import { CONFIG } from 'config';
import { Web3Context } from 'contexts/Web3Context';
import { CopyIcon } from 'icons/CopyIcon';
import React, { useContext } from 'react';
import { copyToClipboard, formatValue } from 'utils/helpers';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
};
export const GrantHeader: React.FC<Props> = ({ grant }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { ethersProvider, isSupportedNetwork } = useContext(Web3Context);
  const toast = useToast();
  const grantAddressDisplay = useBreakpointValue({
    base: `${grant.id.slice(0, 12).toUpperCase()}...`,
    sm: `${grant.id.slice(0, 24).toUpperCase()}...`,
    md: grant.id,
  });

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
      px="2rem"
      w="100%"
      color="white"
      bgImage={`url(${HeaderBG})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      backgroundAttachment="fixed"
      pt="6rem"
      pb="1rem"
    >
      <Link
        color="white"
        fontSize="clamp(1.5rem, 5vw, 3rem)"
        fontWeight="800"
        textAlign="center"
        to={`/grant/${grant.id}`}
        maxW="35rem"
        whiteSpace="pre-wrap"
      >
        {grant.name}
      </Link>
      <Text
        maxW="40rem"
        w="auto"
        mb={2}
        textAlign="center"
        fontSize={{ base: '.8rem', sm: '1rem' }}
      >
        {grant.description}
      </Text>
      <Divider w="2rem" borderWidth="2px" mb={2} />
      <Link
        to={grant.link}
        isExternal
        overflowWrap="break-word"
        wordBreak="break-word"
        fontSize={{ base: '.8rem', sm: '1rem' }}
        fontFamily="Roboto Mono, monospace"
        textAlign="center"
      >
        {grant.link}
      </Link>
      <Flex mb={6} align="center" fontFamily="Roboto Mono, monospace">
        <Link
          to={`${CONFIG.explorerEndpoint}/address/${grant.id}`}
          textTransform="uppercase"
          isExternal
          fontSize={{ base: '.7rem', sm: '.8rem' }}
        >
          {grantAddressDisplay}
        </Link>
        {document.queryCommandSupported('copy') && (
          <Button
            ml={4}
            onClick={() => copyToClipboard(grant.id.toLowerCase())}
            variant="ghost"
            color="white"
            _hover={{ background: 'black20' }}
            h="auto"
            w="auto"
            minW="2"
            p={2}
          >
            <CopyIcon boxSize={4} />
          </Button>
        )}
      </Flex>
      <Button
        borderRadius="full"
        variant="solid"
        color="dark"
        background="cyan.100"
        _hover={{ background: 'cyan.400' }}
        size="lg"
        fontWeight="500"
        px={10}
        onClick={openFundModal}
        mb={8}
      >
        Fund this grant
      </Button>
      <FundGrantModal
        grantAddress={grant.id}
        isOpen={isOpen}
        onClose={onClose}
      />
      <SimpleGrid
        columns={4}
        spacing={4}
        justifySelf="flex-end"
        mb={8}
        fontFamily="Roboto Mono, monospace"
      >
        <a href="#funders">
          <AmountDisplay
            amount={grant.funders ? grant.funders.length.toString() : '0'}
            label={
              grant.funders && grant.funders.length === 1 ? 'Funder' : 'Funders'
            }
          />
        </a>
        <a href="#details">
          <AmountDisplay
            amount={`Ξ${formatValue(grant.pledged)}`}
            label="Pledged"
          />
        </a>
        <a href="#details">
          <AmountDisplay
            amount={`Ξ${formatValue(grant.funded)}`}
            label="Paid Out"
          />
        </a>
        <a href="#recipients">
          <AmountDisplay
            amount={grant.grantees.length.toString()}
            label={grant.grantees.length === 1 ? 'Grantee' : 'Grantees'}
          />
        </a>
      </SimpleGrid>
    </VStack>
  );
};
