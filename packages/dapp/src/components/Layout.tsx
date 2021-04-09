import { Flex, Image, Link, useDisclosure } from '@chakra-ui/react';
import BuiltByRG from 'assets/raidguild.svg';
import { Header } from 'components/Header';
import { NavBar } from 'components/NavBar';
import { SearchContextProvider } from 'contexts/SearchContext';
import { Web3Context } from 'contexts/Web3Context';
import { useGraphHealth } from 'hooks/useGraphHealth';
import React, { useContext } from 'react';

import { ConnectWeb3 } from './ConnectWeb3';

export const Layout: React.FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isSupportedNetwork } = useContext(Web3Context);
  useGraphHealth(
    'Cannot access latest grants data. Wait for a few minutes and reload the application',
  );

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
      justify={isSupportedNetwork ? 'initial' : 'center'}
    >
      {isSupportedNetwork ? (
        <>
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
          <Flex w="100%" justify="center" align="center" pb="0.5rem">
            <Link href="https://raidguild.org" isExternal>
              <Image src={BuiltByRG} alt="Built by Raid Guild" h="2.5rem" />
            </Link>
          </Flex>
        </>
      ) : (
        <ConnectWeb3 />
      )}
    </Flex>
  );
};
