import {
  Button,
  Image,
  ModalCloseButton,
  ModalContent,
  Text,
  VStack,
} from '@chakra-ui/react';
import ChestImage from 'assets/chest.svg';
import SuccessBG from 'assets/success.svg';
import { Link } from 'components/Link';
import React from 'react';

type Props = {
  faq: string;
  title: string;
  grantAddress: string;
};

export const SuccessModal: React.FC<Props> = ({ faq, title, grantAddress }) => {
  return (
    <ModalContent
      borderRadius="1rem"
      maxW="40rem"
      mx={{ base: 8, lg: 0 }}
      bgImage={`url(${SuccessBG})`}
      bgSize="300% 300%"
      bgPosition="center"
      bgRepeat="no-repeat"
      color="text"
      fontFamily="body"
      p={6}
    >
      <Link to="/faq" textDecor="underline" isExternal>
        {faq}
      </Link>

      <VStack spacing={4} w="100%" py={6} mb={4}>
        <Text
          fontSize={{ base: '1.5rem', sm: '2rem', md: '3rem' }}
          fontWeight="800"
          textAlign="center"
          color="dark"
        >
          {title}
        </Text>
        <Image src={ChestImage} alt="chest" transform="translateX(1rem)" />
      </VStack>
      <Button
        size="lg"
        background="white"
        color="text"
        textTransform="uppercase"
        w="100%"
        boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
        letterSpacing="0.115em"
        onClick={() => {
          window.location.href = `/grant/${grantAddress}`;
        }}
      >
        View the grant
      </Button>
      <ModalCloseButton top={4} right={4} fontSize={16} />
    </ModalContent>
  );
};
