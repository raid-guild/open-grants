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
      <Text maxW="55rem" w="auto">
        {grant.description}
      </Text>
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
        <a href="#funders">
          <Flex
            direction="column"
            h="100%"
            justify="space-between"
            _hover={{ color: 'text' }}
            transition="0.25s"
          >
            <Text fontWeight="500" fontSize="3xl" textAlign="center">
              {grant.funders ? grant.funders.length : 0}
            </Text>
            <Text textTransform="uppercase" textAlign="center">
              {grant.funders && grant.funders.length === 1
                ? 'Funder'
                : 'Funders'}
            </Text>
          </Flex>
        </a>
        <a href="#details">
          <Flex
            direction="column"
            h="100%"
            justify="space-between"
            _hover={{ color: 'text' }}
            transition="0.25s"
          >
            <Text fontWeight="500" fontSize="3xl" textAlign="center">
              {`${formatValue(grant.pledged)} ETH`}
            </Text>
            <Text textTransform="uppercase" textAlign="center">
              Pledged
            </Text>
          </Flex>
        </a>
        <a href="#details">
          <Flex
            direction="column"
            h="100%"
            justify="space-between"
            _hover={{ color: 'text' }}
            transition="0.25s"
          >
            <Text fontWeight="500" fontSize="3xl" textAlign="center">
              {`${formatValue(grant.vested)} ETH`}
            </Text>
            <Text textTransform="uppercase" textAlign="center">
              Vested
            </Text>
          </Flex>
        </a>
        <a href="#recipients">
          <Flex
            direction="column"
            h="100%"
            justify="space-between"
            _hover={{ color: 'text' }}
            transition="0.25s"
          >
            <Text fontWeight="500" fontSize="3xl" textAlign="center">
              {grant.grantees.length}
            </Text>
            <Text textTransform="uppercase" textAlign="center">
              {grant.grantees.length === 1 ? 'Grantee' : 'Grantees'}
            </Text>
          </Flex>
        </a>
      </SimpleGrid>
    </VStack>
  );
};
