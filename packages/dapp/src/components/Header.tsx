import {
  Button,
  Flex,
  HStack,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import EthereumCrystalIcon from 'assets/eth-icon.png';
import { Link } from 'components/Link';
import { SearchBar } from 'components/SearchBar';
import { Web3Context } from 'contexts/Web3Context';
import { ArrowDownIcon } from 'icons/ArrowDownIcon';
import React, { useContext, useEffect, useState } from 'react';
import { getProfile } from 'utils/3box';
import { BoxProfile } from 'utils/types';

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
  const accountString = useBreakpointValue({
    base: `${account.slice(0, 4).toUpperCase()}...`,
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
          ml={-2}
          to="/"
          fontSize="1.25rem"
          color="white"
          px={2}
          py={1}
          borderRadius={4}
          _hover={{ textDecoration: 'none', background: 'black10' }}
          transition="0.25s"
        >
          <Image
            src={EthereumCrystalIcon}
            alt="Ethereum Crystal Icon"
            height="2rem"
            pr={2}
            display={{ base: 'none', sm: 'inline' }}
          />
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
                    w={{ base: '1.5rem', md: '2.25rem' }}
                    h={{ base: '1.5rem', md: '2.25rem' }}
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
                  <Text
                    px={2}
                    display={{ base: 'none', sm: 'flex' }}
                    fontSize={{ base: '.75rem', md: '.9rem' }}
                    fontFamily="'Roboto Mono', monospace;"
                  >
                    {profile?.name ? profile.name : accountString}
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
