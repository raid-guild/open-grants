import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { FundGrantModal } from 'components/FundGrantModal';
import { Link, LinkButton } from 'components/Link';
import { CONFIG } from 'config';
import { Web3Context } from 'contexts/Web3Context';
import React, { useContext } from 'react';
import { formatValue } from 'utils/helpers';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
  myGrant?: boolean;
  showName?: boolean;
};

export const GrantDetails: React.FC<Props> = ({
  grant,
  myGrant = false,
  showName = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonSize = useBreakpointValue({ base: 'lg', md: 'md' });
  const { ethersProvider, isSupportedNetwork } = useContext(Web3Context);
  const toast = useToast();
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
    <Flex
      id="details"
      w="100%"
      background="white"
      boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
      borderRadius="0.5rem"
      p={{ base: '6', md: '8' }}
      position="relative"
      color="text"
      direction="column"
      align="flex-start"
    >
      <Flex
        w="100%"
        justify="space-between"
        align={{ base: 'stretch', sm: 'center' }}
        mb={4}
        p={2}
        direction={{ base: 'column', sm: 'row' }}
      >
        {showName ? (
          <Link
            to={`/grant/${grant.id}`}
            color="dark"
            fontWeight="bold"
            fontSize="xl"
          >
            {grant.name}
          </Link>
        ) : (
          <Text fontWeight="bold" color="dark" fontSize="xl">
            Grant Details
          </Text>
        )}
        <Text fontSize="sm" color="green.500" ml={{ base: 0, md: 4 }}>
          {useBreakpointValue({
            base: 'Open for Funding',
            sm: 'Open',
            md: 'Open for Funding',
          })}
        </Text>
      </Flex>
      <SimpleGrid
        columns={[1, 2, null, 4]}
        spacing={4}
        letterSpacing="0.3px"
        justifySelf="flex-end"
        mb={4}
        p={2}
      >
        <Flex direction="column" h="100%" justify="space-between">
          <Text fontWeight="500" fontSize="2xl" color="green.500">
            {`${formatValue(grant.pledged, 3)} ETH`}
          </Text>
          <Text textTransform="uppercase">Pledged</Text>
        </Flex>
        <Flex direction="column" h="100%" justify="space-between">
          <Text fontWeight="500" fontSize="2xl" color="green.500">
            {`${formatValue(grant.funded, 3)} ETH`}
          </Text>
          <Text textTransform="uppercase">Paid Out</Text>
        </Flex>
        <Flex direction="column" h="100%" justify="space-between">
          <Text fontWeight="500" fontSize="2xl" color="green.500">
            {`${formatValue(grant.vested, 3)} ETH`}
          </Text>
          <Text textTransform="uppercase">Available</Text>
        </Flex>
      </SimpleGrid>
      <Flex
        w="100%"
        justify="space-between"
        align="stretch"
        direction={{ base: 'column-reverse', md: 'row' }}
      >
        <Flex
          align={{ base: 'stretch', md: 'center' }}
          mr={{ base: 0, md: 8 }}
          mt={{ base: 4, md: 0 }}
          p={2}
          direction={{ base: 'column-reverse', md: 'row' }}
        >
          <Text fontSize="sm">{`Created ${new Date(
            grant.timestamp * 1000,
          ).toLocaleDateString()}`}</Text>
          <Box ml={{ base: 0, md: 8 }} mb={{ base: 2, md: 0 }}>
            <Link
              isExternal
              textDecoration="underline"
              to={`${CONFIG.explorerEndpoint}/address/${grant.id}`}
              fontSize="sm"
            >
              View the contract
            </Link>
          </Box>
          {!myGrant && (
            <>
              {grant.contactLink && (
                <Box ml={{ base: 0, md: 8 }} mb={{ base: 2, md: 0 }}>
                  <Link
                    isExternal
                    textDecoration="underline"
                    to={grant.contactLink}
                    fontSize="sm"
                  >
                    Contact the team
                  </Link>
                </Box>
              )}
              <Box ml={{ base: 0, md: 8 }} mb={{ base: 2, md: 0 }}>
                <Link
                  textDecoration="underline"
                  to={`/grant/${grant.id}/streams`}
                  fontSize="sm"
                >
                  Distribute funds
                </Link>
              </Box>
            </>
          )}
        </Flex>
        {myGrant ? (
          <LinkButton
            w={{ base: '100%', md: 'auto' }}
            colorScheme="green"
            textTransform="uppercase"
            boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
            size={buttonSize}
            to={`/grant/${grant.id}/streams`}
          >
            Distribute Funds
          </LinkButton>
        ) : (
          <Button
            w={{ base: '100%', md: 'auto' }}
            colorScheme="green"
            textTransform="uppercase"
            boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
            size={buttonSize}
            onClick={openFundModal}
          >
            Fund
          </Button>
        )}
      </Flex>
      <FundGrantModal
        grantAddress={grant.id}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};
