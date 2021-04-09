import { Button, Flex, Text } from '@chakra-ui/react';
import HeaderBG from 'assets/header.jpg';
import { LoadingPage } from 'components/LoadingPage';
import { CONFIG } from 'config';
import { Web3Context } from 'contexts/Web3Context';
import { WalletFilledIcon } from 'icons/WalletFilledIcon';
import React, { useContext } from 'react';

export const ConnectWeb3: React.FC = () => {
  const { loading, disconnect } = useContext(Web3Context);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Flex
      borderRadius="1rem"
      direction="column"
      align="center"
      w="calc(100% - 2rem)"
      p="2rem"
      maxW="27.5rem"
      mx={4}
      color="white"
      bgImage={`url(${HeaderBG})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      backgroundAttachment="fixed"
    >
      <Flex
        bg="red.500"
        borderRadius="50%"
        p="1rem"
        justify="center"
        align="center"
        color="white"
        mb={4}
      >
        <WalletFilledIcon boxSize="1.75rem" />
      </Flex>
      <Text fontWeight="bold" fontSize="2xl" mb={4}>
        Network not supported
      </Text>
      <Text mb={4} textAlign="center">
        {`Please switch to ${CONFIG.network.name}`}
      </Text>
      <Button
        onClick={disconnect}
        colorScheme="whiteAlpha"
        bgColor="white"
        color="dark"
        px={12}
      >
        Disconnect
      </Button>
    </Flex>
  );
};
