import {
  Button,
  Flex,
  HStack,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { Link } from 'components/Link';
import { Web3Context } from 'contexts/Web3Context';
import { ArrowDownIcon } from 'icons/ArrowDownIcon';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getProfile, Profile } from 'utils/3box';

type Props = {
  onOpen: () => void;
};

export const Header: React.FC<Props> = ({ onOpen }) => {
  const { account, connectWeb3, disconnect } = useContext(Web3Context);
  const [profile, setProfile] = useState<Profile | undefined>();
  useEffect(() => {
    async function fetchProfile() {
      setProfile(await getProfile(account));
    }
    if (account) {
      fetchProfile();
    }
  }, [account]);
  const history = useHistory();
  const bgImage =
    history.location.pathname === '/create' ? `url(${HeaderBG})` : undefined;

  return (
    <Flex
      w="100%"
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      px={{ base: 4, sm: 8 }}
      color="white"
      fontWeight="500"
      bgImage={bgImage}
      bgSize="cover"
      h="5rem"
      position="absolute"
      top="0"
      left="0"
    >
      <HStack spacing={{ base: 2, sm: 4 }}>
        <Button
          variant="link"
          onClick={onOpen}
          minW={4}
          p={2}
          ml={-2}
          _hover={{ background: 'black10' }}
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
                  fontWeight="normal"
                  background="white60"
                  _hover={{ background: 'white80' }}
                  color="dark"
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
                  color="dark"
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
