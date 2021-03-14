import {
  Button,
  keyframes,
  ModalCloseButton,
  ModalContent,
  Text,
  VStack,
} from '@chakra-ui/react';
import LoadingBG from 'assets/waves.svg';
import { Link } from 'components/Link';
import { Loader } from 'components/Loader';
import { CONFIG } from 'config';
import React from 'react';

const loading = keyframes`
  0% {
    background-position: -640px 100%;
  }
  50% {
    background-position: 0 110%;
  }
  100% {
    background-position: +640px 100%;
  }
`;

type Props = {
  faq: string;
  title: string;
  txHash: string;
  onClose: () => void;
};

export const LoadingModal: React.FC<Props> = ({
  faq,
  title,
  txHash,
  onClose,
}) => {
  return (
    <ModalContent
      borderRadius="1rem"
      maxW="40rem"
      mx={{ base: 8, lg: 0 }}
      background="background"
      color="text"
      fontFamily="body"
      p={6}
      bgImage={`url(${LoadingBG})`}
      bgRepeat="repeat-x"
      animation={`${loading} 10s linear infinite`}
    >
      <Link to="/faq" textDecor="underline" isExternal>
        {faq}
      </Link>

      <VStack spacing={4} w="100%" py={4}>
        <Text
          fontSize={{ base: '1.5rem', sm: '2rem', md: '3rem' }}
          fontWeight="800"
          textAlign="center"
          color="dark"
        >
          {title}
        </Text>
        <Link
          to={`${CONFIG.explorerEndpoint}/tx/${txHash}`}
          textDecor="underline"
          textAlign="center"
          isExternal
          mb={16}
        >
          View the transaction in Etherscan
        </Link>
        <Loader size={0.8} />
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
