import {
  Button,
  Flex,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { FundGrantModal } from 'components/FundGrantModal';
import { Link } from 'components/Link';
import React from 'react';
import { formatValue } from 'utils/helpers';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
};
export const GrantHeader: React.FC<Props> = ({ grant }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <VStack
      px="2rem"
      w="100%"
      justify="flex-end"
      color="white"
      bgImage={`url(${HeaderBG})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      minH="35rem"
      pt="5rem"
    >
      <Text
        fontSize={{ base: '2rem', md: '3rem' }}
        fontWeight="800"
        textAlign="center"
      >
        {grant.name}
      </Text>
      <Text>{grant.description}</Text>
      <Link to={grant.link} isExternal mb={8}>
        {grant.link}
      </Link>
      <Button
        borderRadius="full"
        variant="solid"
        color="dark"
        background="cyan.100"
        _hover={{ background: 'cyan.400' }}
        size="lg"
        fontWeight="500"
        px={10}
        onClick={onOpen}
        mb={12}
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
        letterSpacing="0.3px"
        justifySelf="flex-end"
        mb={8}
      >
        <Flex direction="column">
          <Text fontWeight="500" fontSize="3xl" textAlign="center">
            {grant.funders ? grant.funders.length : 0}
          </Text>
          <Text textTransform="uppercase" textAlign="center">
            {grant.funders && grant.funders.length === 1 ? 'Funder' : 'Funders'}
          </Text>
        </Flex>
        <Flex direction="column">
          <Text fontWeight="500" fontSize="3xl" textAlign="center">
            {`${formatValue(grant.pledged)} ETH`}
          </Text>
          <Text textTransform="uppercase" textAlign="center">
            Pledged
          </Text>
        </Flex>
        <Flex direction="column">
          <Text fontWeight="500" fontSize="3xl" textAlign="center">
            {`${formatValue(grant.vested)} ETH`}
          </Text>
          <Text textTransform="uppercase" textAlign="center">
            Vested
          </Text>
        </Flex>
        <Flex direction="column">
          <Text fontWeight="500" fontSize="3xl" textAlign="center">
            {grant.grantees.length}
          </Text>
          <Text textTransform="uppercase" textAlign="center">
            {grant.grantees.length === 1 ? 'Grantee' : 'Grantees'}
          </Text>
        </Flex>
      </SimpleGrid>
    </VStack>
  );
};
