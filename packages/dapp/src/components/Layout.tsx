import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  useDisclosure,
} from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { Header } from 'components/Header';
import { NavBar } from 'components/NavBar';
import { CONFIG } from 'config';
import { SearchContextProvider } from 'contexts/SearchContext';
import { Web3Context } from 'contexts/Web3Context';
import React, { useContext } from 'react';

export const Layout: React.FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isSupportedNetwork } = useContext(Web3Context);
  if (!isSupportedNetwork) {
    return (
      <Flex
        w="100%"
        h="100vh"
        justify="center"
        align="center"
        bgImage={`url(${HeaderBG})`}
        bgSize="cover"
        bgRepeat="no-repeat"
        position="fixed"
        top={0}
        left={0}
        color="white"
        direction="column"
        p={4}
      >
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          bg="transparent"
        >
          <AlertIcon
            boxSize={{ base: '32px', sm: '48px', md: '64px' }}
            mr={0}
          />
          <AlertTitle
            mt={4}
            mb={1}
            fontSize={{ base: '1.5rem', sm: '2rem', md: '3rem' }}
          >
            Unsupported Network!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Please connect your wallet to {CONFIG.network.name}
          </AlertDescription>
        </Alert>
      </Flex>
    );
  }

  return (
    <Flex
      p={0}
      m={0}
      overflowX="hidden"
      fontFamily="body"
      w="100%"
      minH="100vh"
      align="center"
      direction="column"
      background="background"
      position="relative"
    >
      <NavBar isOpen={isOpen} onClose={onClose} />
      <SearchContextProvider>
        <Header onOpen={onOpen} />
      </SearchContextProvider>
      <Flex
        flex={1}
        align="center"
        justify="flex-start"
        direction="column"
        w="100%"
        h="100%"
      >
        {children}
      </Flex>
    </Flex>
  );
};
