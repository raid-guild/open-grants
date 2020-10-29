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
  useDisclosure,
  VStack,
} from '@chakra-ui/core';
import { Link } from 'components/Link';
import { CONFIG } from 'config';
import { SearchContext } from 'contexts/SearchContext';
import { SearchIcon } from 'icons/SearchIcon';
import React, { useContext, useRef, useState } from 'react';

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
  return (
    <Popover
      initialFocusRef={inputRef}
      isOpen={isOpen}
      onOpen={searchOpen}
      onClose={searchClose}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <InputGroup
          maxW="26rem"
          w="100%"
          size="lg"
          color="white"
          _hover={!isOpen ? { color: 'text' } : undefined}
          background="transparent"
        >
          <Input
            borderRadius="full"
            background="transparent"
            mx={!isOpen ? 0 : 2}
            fontSize="md"
            placeholder="SEARCH"
            _placeholder={{ color: 'white80' }}
            px={!isOpen ? 0 : 10}
            minH="3.25rem"
            color="white"
            value={search}
            onChange={e => setSearch(e.target.value)}
            ref={inputRef}
            w={searchWidth}
            cursor={!isOpen ? 'pointer' : undefined}
            border={!isOpen ? 'none' : undefined}
            transition="0.25s"
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
              <SearchIcon boxSize={5} transition="0.25s" />
            )}
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        background="white"
        color="text"
        maxW="24rem"
        transform="translateX(-1.5rem)"
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
                        <Flex w="100%" justify="space-between" align="center">
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
  );
};
