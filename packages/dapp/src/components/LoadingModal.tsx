import {
  Button,
  Image,
  keyframes,
  ModalCloseButton,
  ModalContent,
  Text,
  VStack,
} from '@chakra-ui/core';
import LoadingBG from 'assets/loading-background.png';
import WhaleImage from 'assets/whale.svg';
import { Link } from 'components/Link';
import { CONFIG } from 'config';
import React from 'react';

const loading = keyframes`
  0% {
    background-position: 50% -750%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% -750%;
  }
`;

type Props = {
  title: string;
  txHash: string;
  onClose: () => void;
};
export const LoadingModal: React.FC<Props> = ({ title, txHash, onClose }) => {
  return (
    <ModalContent
      borderRadius="1rem"
      maxW="40rem"
      mx={{ base: 8, lg: 0 }}
      background="background"
      color="text"
      p={6}
      bgImage={`url(${LoadingBG})`}
      bgSize="100%"
      bgRepeat="no-repeat"
      animation={`${loading} 10s linear infinite`}
    >
      <Link to="/faq" textDecor="underline">
        First time? View the funding FAQ
      </Link>

      <VStack spacing={4} w="100%" py={6}>
        <Text
          fontSize={{ base: '2rem', md: '3rem' }}
          fontWeight="800"
          textAlign="center"
          color="dark"
        >
          {title}
        </Text>
        <Link
          to={`${CONFIG.explorerEndpoint}/tx/${txHash}`}
          textDecor="underline"
          isExternal
          mb={4}
        >
          View the transaction in Etherscan
        </Link>
        <Image src={WhaleImage} />
      </VStack>
      <Button
        size="lg"
        background="white"
        color="text"
        textTransform="uppercase"
        w="100%"
        boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
        letterSpacing="0.115em"
        onClick={onClose}
      >
        Close
      </Button>
      <ModalCloseButton top={4} right={4} fontSize={16} />
    </ModalContent>
  );
};
