import { Button, Text, useDisclosure, VStack } from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { FundGrantModal } from 'components/FundGrantModal';
import { Link } from 'components/Link';
import { Grant } from 'graphql/autogen/types';
import React from 'react';

type Props = {
  grant: Grant;
};
export const GrantHeader: React.FC<Props> = ({ grant }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <VStack
      px="2rem"
      w="100%"
      justify="center"
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
        _hover={{ background: 'cyan.200' }}
        size="lg"
        fontWeight="500"
        px={10}
        onClick={onOpen}
      >
        Fund this grant
      </Button>
      <FundGrantModal
        grantAddress={grant.grantAddress}
        isOpen={isOpen}
        onClose={onClose}
      />
    </VStack>
  );
};
