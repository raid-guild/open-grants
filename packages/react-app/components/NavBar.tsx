import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Link,
  VStack,
} from '@chakra-ui/core';
import { Web3Context } from 'contexts/Web3Context';
import React, { useContext } from 'react';

import { DrawerBG } from '../assets/drawer.jpg';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const NavBar: React.FC<Props> = ({ isOpen, onClose }) => {
  const { account, disconnect } = useContext(Web3Context);
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent background={DrawerBG} bgSize="cover" color="white">
          <DrawerCloseButton _focus={{ outline: 'none', border: 'none' }} />
          <DrawerHeader mb={4}>Menu</DrawerHeader>

          <DrawerBody>
            <VStack spacing={5} align="flex-start">
              <Link href="/">Explore Grants</Link>
              <Link href="/">My Grants</Link>
              <Link href="/">Create a Grant</Link>
              <Link href="/faq">FAQ</Link>
            </VStack>
          </DrawerBody>

          <DrawerFooter justifyContent="flex-start">
            {account && (
              <Button
                onClick={() => {
                  disconnect();
                  onClose();
                }}
                size="md"
                variant="ghost"
                _hover={{ background: 'green.600' }}
                color="white"
              >
                Sign Out
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
