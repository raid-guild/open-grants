import {
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from '@chakra-ui/core';
import { Web3Context } from 'contexts/Web3Context';
import { Link } from 'components/Link';
import React, { useContext } from 'react';

import DrawerBG from 'assets/navbar.jpg';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const NavBar: React.FC<Props> = ({ isOpen, onClose }) => {
  const { account, disconnect } = useContext(Web3Context);
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent
          color="white"
          bgImage={`url(${DrawerBG})`}
          bgSize="cover"
          bgRepeat="no-repeat"
          fontFamily="body"
        >
          <Flex
            direction="column"
            position="relative"
            background="rgba(93, 106, 116, 0.26)"
            bgSize="cover"
            w="100%"
            h="100%"
            p={2}
          >
            <DrawerCloseButton
              top={6}
              right={6}
              fontSize={18}
            />
            <DrawerHeader fontWeight={600} fontSize="2xl" mb={4}>
              Menu
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing={5} align="flex-start">
                <Link href="/">Explore Grants</Link>
                {account && <Link href="/">My Grants</Link>}
                {account && <Link href="/create">Create a Grant</Link>}
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
                  variant="link"
                  color="white"
                >
                  Sign Out
                </Button>
              )}
            </DrawerFooter>
          </Flex>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
