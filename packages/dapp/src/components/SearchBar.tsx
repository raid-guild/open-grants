import {
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
  useDisclosure,
  VStack,
} from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { Link } from 'components/Link';
import { SearchContext } from 'contexts/SearchContext';
import { SearchIcon } from 'icons/SearchIcon';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { BoxProfile, getProfile } from 'utils/3box';

const UserProfile: React.FC<{ account: string }> = ({ account }) => {
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    if (account) {
      getProfile(account).then(p => setProfile(p));
    }
  }, [account]);
  const accountString = `${account.slice(0, 7).toUpperCase()}...`;
  return (
    <HStack w="100%" key={account}>
      <Link to={`/profile/${account}`} w="100%">
        <Flex w="100%" justify="space-between" align="center">
          <Text>{profile?.name ? profile.name : accountString}</Text>
          <Flex
            borderRadius="50%"
            border="1px solid #E6E6E6"
            w="2rem"
            h="2rem"
            overflow="hidden"
            background="white"
            bgImage={profile && `url(${profile.imageUrl})`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgPosition="center center"
          />
        </Flex>
      </Link>
    </HStack>
  );
};

export const SearchBar: React.FC = () => {
  const { search, setSearch, result, fetching } = useContext(SearchContext);
  const [searchWidth, setSearchWidth] = useState<number | string>(0);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const inputRef = useRef(null);
  const searchOpen = () => {
    setSearchWidth('auto');
    onOpen();
  };
  const searchClose = () => {
    setSearch('');
    setSearchWidth(0);
    onClose();
  };
  const isSmall = useBreakpointValue({ base: true, md: false });
  return (
    <Flex
      h={isOpen && isSmall ? '100vh' : undefined}
      w={isOpen && isSmall ? '100%' : undefined}
      position={isOpen && isSmall ? 'fixed' : undefined}
      top={isOpen && isSmall ? '0' : undefined}
      left={isOpen && isSmall ? 0 : undefined}
      bgImage={isOpen && isSmall ? `url(${HeaderBG})` : undefined}
      bgSize="cover"
      zIndex={isOpen && isSmall ? 1 : undefined}
      mr={2}
    >
      <Popover
        initialFocusRef={inputRef}
        isOpen={isOpen}
        onOpen={searchOpen}
        onClose={searchClose}
        placement="bottom"
      >
        <PopoverTrigger>
          <Flex
            position={isOpen && isSmall ? 'fixed' : undefined}
            top={isOpen && isSmall ? '1rem' : undefined}
            left={isOpen && isSmall ? 0 : undefined}
            w={isOpen && isSmall ? '100%' : undefined}
            justify={isOpen && isSmall ? 'center' : 'flex-end'}
          >
            <Flex>
              <InputGroup size="lg" color="white" background="transparent">
                <Input
                  borderRadius="full"
                  background="transparent"
                  mx={!isOpen ? 0 : 2}
                  fontSize="md"
                  placeholder="SEARCH"
                  _placeholder={{ color: 'white80' }}
                  p={!isOpen ? 0 : undefined}
                  minH="3.25rem"
                  color="white"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  ref={inputRef}
                  w={searchWidth}
                  maxW={{
                    base: '20rem',
                    sm: '24rem',
                    md: '16rem',
                    lg: '24rem',
                  }}
                  cursor={!isOpen ? 'pointer' : undefined}
                  border={!isOpen ? 'none' : undefined}
                  transition="0.25s"
                />
                <InputRightElement
                  _hover={!isOpen ? { background: 'black10' } : undefined}
                  borderRadius={!isOpen ? 4 : undefined}
                  pointerEvents={!isOpen ? undefined : 'none'}
                  cursor={!isOpen ? 'pointer' : undefined}
                  zIndex="initial"
                  h="auto"
                  w={!isOpen ? 'auto' : undefined}
                  p={2}
                  my={2}
                  mr={isOpen ? 2 : undefined}
                >
                  {fetching ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    <SearchIcon boxSize={5} transition="0.25s" />
                  )}
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Flex>
        </PopoverTrigger>
        <PopoverContent
          background="white"
          color="text"
          maxH="30rem"
          maxW={{ base: '20rem', sm: '24rem' }}
          overflowY="auto"
          onClick={searchClose}
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
                {result.users && result.users.length > 0 && (
                  <>
                    {result.grants.length > 0 && <Divider />}
                    {result.users.map(u => (
                      <UserProfile key={u.id} account={u.id} />
                    ))}
                  </>
                )}
                {result.grants.length === 0 &&
                  (!result.users || result.users.length === 0) && (
                    <Text>Your search returned no results</Text>
                  )}
              </>
            ) : (
              <Text>Search for any user or grant</Text>
            )}
          </VStack>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
