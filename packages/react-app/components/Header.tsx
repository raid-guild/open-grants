import { Button, Flex, HStack, Text, useDisclosure } from '@chakra-ui/core';
import { NavBar } from 'components/NavBar';
import { Web3Context } from 'contexts/Web3Context';
import { Link } from 'components/Link';
import React, { useContext } from 'react';

export const Header: React.FC = () => {
  const { account, connectWeb3 } = useContext(Web3Context);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      w="100%"
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      py={6}
      px={8}
      background="green.500"
      color="white"
      fontWeight="500"
    >
      <NavBar isOpen={isOpen} onClose={onClose} />
      <HStack spacing={4}>
        <Button
          variant="link"
          onClick={onOpen}
          minW={4}
          p={2}
          ml={-2}
          _hover={{ background: 'rgba(0,0,0,0.1)' }}
        >
          <svg
            fill="white"
            width="1.5rem"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Button>
        <Link href="/" fontSize="1.25rem">
          Open Grants
        </Link>
      </HStack>

      <HStack spacing={4}>
        {!account && (
          <Button
            onClick={connectWeb3}
            size="md"
            textTransform="uppercase"
            variant="link"
            color="white"
          >
            Sign In
          </Button>
        )}
        {account && (
          <Flex justify="center" align="center">
            <Text>{account}</Text>
          </Flex>
        )}
      </HStack>
    </Flex>
  );
};
