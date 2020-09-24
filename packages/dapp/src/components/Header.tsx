import {
  Button,
  Flex,
  HStack,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/core';
import { Link } from 'components/Link';
import { NavBar } from 'components/NavBar';
import { Web3Context } from 'contexts/Web3Context';
import { ArrowDownIcon } from 'icons/ArrowDownIcon';
import React, { useContext, useEffect, useState } from 'react';
import { getProfile, Profile } from 'utils/3box';

export const Header: React.FC = () => {
  const { account, connectWeb3, disconnect } = useContext(Web3Context);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState<Profile | undefined>();
  useEffect(() => {
    async function fetchProfile() {
      setProfile(await getProfile(account));
    }
    if (account) {
      fetchProfile();
    }
  }, [account]);

  return (
    <Flex
      w="100%"
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      py={4}
      px={{ base: 4, sm: 8 }}
      background="green.500"
      color="white"
      fontWeight="500"
    >
      <NavBar isOpen={isOpen} onClose={onClose} />
      <HStack spacing={{ base: 2, sm: 4 }}>
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
        <Link to="/" fontSize="1.25rem" color="white">
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
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Button
                  borderRadius="full"
                  size="lg"
                  h="auto"
                  _hover={{ background: 'white' }}
                  fontWeight="normal"
                  bg="white60"
                  color="black"
                  border="white60"
                  p={2}
                >
                  <Flex
                    borderRadius="50%"
                    w="2.5rem"
                    h="2.5rem"
                    overflow="hidden"
                    justify="center"
                    align="center"
                    background="white"
                  >
                    {profile && (
                      <Image w="100%" h="100%" src={profile.imageUrl} />
                    )}
                  </Flex>
                  <Text px={2}>
                    {`${account.slice(0, 4).toUpperCase()}...`}
                  </Text>
                  <ArrowDownIcon boxSize="1.5rem" />
                </Button>
              </PopoverTrigger>
              <PopoverContent bg="none" maxW="auto" w="auto">
                <Button
                  onClick={() => {
                    disconnect();
                  }}
                  bg="white"
                  color="black"
                  border="white"
                  fontWeight="normal"
                >
                  Sign Out
                </Button>
              </PopoverContent>
            </Popover>
          </Flex>
        )}
      </HStack>
    </Flex>
  );
};
