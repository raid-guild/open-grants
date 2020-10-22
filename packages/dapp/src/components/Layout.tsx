import { Flex, useDisclosure } from '@chakra-ui/core';
import { Header } from 'components/Header';
import { NavBar } from 'components/NavBar';
import { SearchContextProvider } from 'contexts/SearchContext';
import React from 'react';

export const Layout: React.FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
