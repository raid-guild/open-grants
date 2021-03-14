import { Image, Text, VStack } from '@chakra-ui/react';
import EthereumCrystalImage from 'assets/eth-crystal-wave.png';
import HeaderBG from 'assets/header.jpg';
import { LinkButton } from 'components/Link';
import React from 'react';

export const ExploreHeader: React.FC = () => {
  return (
    <VStack
      py="5rem"
      w="100%"
      bgImage={`url(${HeaderBG})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      overflow="hidden"
    >
      <VStack w="100%" spacing={8} color="white" position="relative">
        <Image
          position="absolute"
          src={EthereumCrystalImage}
          fallbackSrc={EthereumCrystalImage}
          left="50%"
          top={{ base: '40%', sm: '45%', md: '50%' }}
          transform="translate(-125.5%, 14%) scale(1.75)"
          maxH="27rem"
          minW="30rem"
        />
        <Text
          fontSize={{ base: '2rem', md: '3rem' }}
          fontWeight="800"
          textAlign="center"
          position="relative"
        >
          Open Grants
        </Text>
        <VStack h={{ base: '4rem', md: '8rem' }} />
        <Text textAlign="center" position="relative" px={8}>
          Together we empower developers building the next generation of
          Ethereum
        </Text>
        <LinkButton
          to="/faq"
          borderRadius="full"
          variant="outline"
          borderColor="white"
          _hover={{ background: 'black10' }}
          px={10}
          fontWeight="500"
          size="lg"
          position="relative"
          isExternal
        >
          Read the FAQ
        </LinkButton>
      </VStack>
    </VStack>
  );
};
