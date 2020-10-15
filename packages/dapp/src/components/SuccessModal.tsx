import {
  Button,
  ModalCloseButton,
  ModalContent,
  Text,
  VStack,
} from '@chakra-ui/core';
import SuccessBG from 'assets/success.svg';
import { Link } from 'components/Link';
import React from 'react';

type Props = {
  faq: string;
  title: string;
  grantAddress: string;
  onClose: () => void;
};

export const SuccessModal: React.FC<Props> = ({
  faq,
  title,
  grantAddress,
  onClose,
}) => {
  return (
    <ModalContent
      borderRadius="1rem"
      maxW="40rem"
      mx={{ base: 8, lg: 0 }}
      bgImage={`url(${SuccessBG})`}
      bgSize="150% 150%"
      bgPosition="center"
      bgRepeat="no-repeat"
      color="text"
      p={6}
    >
      <Link to="/faq" textDecor="underline">
        {faq}
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
        <Link to={`/grant/${grantAddress}`} textDecor="underline" mb={4}>
          View the grant
        </Link>
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
