import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  VStack,
} from '@chakra-ui/core';
import DrawerBG from 'assets/navbar.jpg';
import { Link } from 'components/Link';
import { Web3Context } from 'contexts/Web3Context';
import React, { useContext } from 'react';

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
            <DrawerHeader fontWeight={600} fontSize="2xl" mb={4}>
              Menu
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing={5} align="flex-start" color="white">
                <Link to="/explore" onClick={onClose}>
                  Explore Grants
                </Link>
                <Link to="/leaderboard" onClick={onClose}>
                  Leaderboard
                </Link>
                {account && (
                  <Link to={`/profile/${account}`} onClick={onClose}>
                    My Grants
                  </Link>
                )}
                {account && (
                  <Link to="/create" onClick={onClose}>
                    Create a Grant
                  </Link>
                )}
                <Link to="/faq" onClick={onClose} minW="2rem">
                  FAQ
                </Link>
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
            <DrawerCloseButton top={6} right={6} fontSize={18} />
          </Flex>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
