import {
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { Link } from 'components/Link';
import { CONFIG } from 'config';
import { SearchContext } from 'contexts/SearchContext';
import { Web3Context } from 'contexts/Web3Context';
import { ArrowDownIcon } from 'icons/ArrowDownIcon';
import { SearchIcon } from 'icons/SearchIcon';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BoxProfile, getProfile } from 'utils/3box';

type Props = {
  onOpen: () => void;
};

export const Header: React.FC<Props> = ({ onOpen }) => {
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
  const { search, setSearch, result, fetching } = useContext(SearchContext);
  const inputRef = useRef(null);

  return (
    <Flex
      w="100%"
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      px={8}
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
        <Link
          to="/"
          fontSize="1.25rem"
          color="white"
          _hover={{ textDecoration: 'none' }}
        >
          Open Grants
        </Link>
      </HStack>

      <HStack spacing={4}>
        <Popover initialFocusRef={inputRef}>
          <PopoverTrigger>
            <InputGroup
              maxW="26rem"
              size="lg"
              color="white"
              background="transparent"
            >
              <Input
                borderRadius="full"
                background="transparent"
                mx={2}
                fontSize="md"
                placeholder="SEARCH"
                _placeholder={{ color: 'white80' }}
                px={10}
                minH="3.25rem"
                color="white"
                value={search}
                onChange={e => setSearch(e.target.value)}
                ref={inputRef}
              />
              <InputRightElement
                mx={1}
                pointerEvents="none"
                zIndex="initial"
                h="100%"
              >
                {fetching ? (
                  <Spinner color="white" size="sm" />
                ) : (
                  <SearchIcon color="white" />
                )}
              </InputRightElement>
            </InputGroup>
          </PopoverTrigger>
          <PopoverContent
            background="white"
            color="text"
            maxW="24rem"
            transform="translateX(-1rem)"
            maxH="30rem"
            overflowY="auto"
          >
            <VStack spacing={4} p={4}>
              {result ? (
                <>
                  {result.grants.length > 0 &&
                    result.grants.map(g => (
                      <HStack w="100%">
                        <Link to={`/grant/${g.id}`} w="100%">
                          {g.name}
                        </Link>
                      </HStack>
                    ))}
                  {result.users.length > 0 && (
                    <>
                      {result.grants.length > 0 && <Divider />}
                      {result.users.map(u => (
                        <HStack w="100%" key={u.id}>
                          <Link to={`/profile/${u.id}`} w="100%">
                            <Flex
                              w="100%"
                              justify="space-between"
                              align="center"
                            >
                              <Text>
                                {u.name
                                  ? u.name
                                  : `${u.id.slice(0, 7).toUpperCase()}...`}
                              </Text>
                              <Flex
                                borderRadius="50%"
                                border="1px solid #E6E6E6"
                                w="2rem"
                                h="2rem"
                                overflow="hidden"
                                background="white"
                                bgImage={
                                  u.imageHash
                                    ? `url(${CONFIG.ipfsEndpoint}/ipfs/${u.imageHash})`
                                    : `url(https://avatars.dicebear.com/api/jdenticon/${u.id}.svg)`
                                }
                                bgSize="cover"
                                bgRepeat="no-repeat"
                                bgPosition="center center"
                              />
                            </Flex>
                          </Link>
                        </HStack>
                      ))}
                    </>
                  )}
                  {result.grants.length === 0 && result.users.length === 0 && (
                    <Text>Your search returned no results</Text>
                  )}
                </>
              ) : (
                <Text>Search for any user or grant</Text>
              )}
            </VStack>
          </PopoverContent>
        </Popover>
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
                    border="1px solid #E6E6E6"
                    bgImage={profile && `url(${profile.imageUrl})`}
                    bgSize="cover"
                    bgRepeat="no-repeat"
                    bgPosition="center center"
                  />
                  <Text px={2} display={{ base: 'none', sm: 'flex' }}>
                    {accountString}
                  </Text>
                  <ArrowDownIcon boxSize="1.5rem" />
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
