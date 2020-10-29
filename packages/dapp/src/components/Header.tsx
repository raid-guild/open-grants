import {
  Button,
  Flex,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useBreakpointValue,
} from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { Link } from 'components/Link';
import { SearchBar } from 'components/SearchBar';
import { Web3Context } from 'contexts/Web3Context';
import { ArrowDownIcon } from 'icons/ArrowDownIcon';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BoxProfile, getProfile } from 'utils/3box';

type Props = {
  onOpen: () => void;
};

export const Header: React.FC<Props> = ({ onOpen: openNav }) => {
  const { account, connectWeb3, disconnect } = useContext(Web3Context);
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    if (account) {
      getProfile(account).then(p => setProfile(p));
    }
  }, [account]);
  const history = useHistory();
  const headerColorRequired =
    history.location.pathname === '/create' ||
    history.location.pathname === '/leaderboard';
  const bgImage = headerColorRequired ? `url(${HeaderBG})` : undefined;
  const accountString = useBreakpointValue({
    sm: `${account.slice(0, 4).toUpperCase()}...`,
    md: `${account.slice(0, 8).toUpperCase()}...`,
  });

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
          onClick={openNav}
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
        <Link
          to="/"
          fontSize="1.25rem"
          color="white"
          _hover={{ textDecoration: 'none', color: 'text' }}
          transition="0.25s"
        >
          Open Grants
        </Link>
      </HStack>

      <HStack spacing={{ base: 0, md: 4 }} flex={1} justify="flex-end">
        <SearchBar />
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
                  background={{ base: 'transparent', sm: 'white60' }}
                  _hover={{
                    background: { base: 'transparent', sm: 'white80' },
                  }}
                  color="dark"
                  border="white60"
                  p={{ base: 0, sm: 2 }}
                >
                  <Flex
                    borderRadius="50%"
                    w="2.5rem"
                    h="2.5rem"
                    overflow="hidden"
                    justify="center"
                    align="center"
                    background="white"
                    border="1px solid #E6E6E6"
                    bgImage={profile && `url(${profile.imageUrl})`}
                    bgSize="cover"
                    bgRepeat="no-repeat"
                    bgPosition="center center"
                  />
                  <Text px={2} display={{ base: 'none', sm: 'flex' }}>
                    {accountString}
                  </Text>
                  <ArrowDownIcon
                    boxSize="1.5rem"
                    display={{ base: 'none', sm: 'flex' }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent bg="none" w="auto">
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
