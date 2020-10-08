import {
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/core';
import { FundGrantModal } from 'components/FundGrantModal';
import { Link, LinkButton } from 'components/Link';
import { CONFIG } from 'config';
import React from 'react';
import { formatValue } from 'utils/helpers';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
  myGrant?: boolean;
};

export const GrantDetails: React.FC<Props> = ({ grant, myGrant = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        {myGrant ? (
          <Link
            to={`/grant/${grant.id}`}
            color="black"
            fontWeight="bold"
            fontSize="xl"
            mb={6}
          >
            {grant.name}
          </Link>
        ) : (
          <Text fontWeight="bold" color="black" fontSize="xl">
            Grant Details
          </Text>
        )}
        <Text color="green.500"> Open for Funding </Text>
      </Flex>
      <SimpleGrid
        columns={4}
        spacing={4}
        letterSpacing="0.3px"
        justifySelf="flex-end"
        mb={8}
      >
        <Flex direction="column">
          <Text fontWeight="500" fontSize="2xl" color="green.500">
            {`${formatValue(grant.pledged, 3)} ETH`}
          </Text>
          <Text textTransform="uppercase">Pledged</Text>
        </Flex>
        <Flex direction="column">
          <Text fontWeight="500" fontSize="2xl" color="green.500">
            {`${formatValue(grant.vested, 3)} ETH`}
          </Text>
          <Text textTransform="uppercase">Vested</Text>
        </Flex>
        <Flex direction="column">
          <Text fontWeight="500" fontSize="2xl" color="green.500">
            {`${formatValue(grant.funded, 3)} ETH`}
          </Text>
          <Text textTransform="uppercase">Distributed</Text>
        </Flex>
        <Flex direction="column">
          <Text fontWeight="500" fontSize="2xl" color="green.500">
            {`${formatValue(grant.vested.sub(grant.funded), 3)} ETH`}
          </Text>
          <Text textTransform="uppercase">Current Balance</Text>
        </Flex>
      </SimpleGrid>
      <Flex w="100%" justify="space-between" align="center">
        <HStack spacing={8} mr={8}>
          <Text>{`Created ${new Date(
            grant.timestamp * 1000,
          ).toLocaleDateString()}`}</Text>
          <Link
            isExternal
            textDecoration="underline"
            to={`${CONFIG.explorerEndpoint}/address/${grant.id}`}
          >
            View the contract
          </Link>
          {!myGrant && (
            <>
              <Link
                isExternal
                textDecoration="underline"
                to={grant.contactLink}
              >
                Contact the team
              </Link>
              <Link textDecoration="underline" to={`/grant/${grant.id}`}>
                Distribute funds
              </Link>
            </>
          )}
        </HStack>
        {myGrant ? (
          <LinkButton
            colorScheme="green"
            textTransform="uppercase"
            boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
            to={`/grant/${grant.id}`}
          >
            Distribute Funds
          </LinkButton>
        ) : (
          <Button
            colorScheme="green"
            textTransform="uppercase"
            boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
            onClick={onOpen}
          >
            Add Funds
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
