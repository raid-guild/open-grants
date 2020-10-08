import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/core';
import { DurationSelector } from 'components/DurationSelector';
import { Link } from 'components/Link';
import { LoadingModal } from 'components/LoadingModal';
import { MethodSelector } from 'components/MethodSelector';
import { Web3Context } from 'contexts/Web3Context';
import React, { useContext, useState } from 'react';
import { ONEYEAR } from 'utils/constants';
import { createStream, fundGrant } from 'utils/streams';

type Props = {
  grantAddress: string;
  isOpen: boolean;
  onClose: () => void;
};
export const FundGrantModal: React.FC<Props> = ({
  grantAddress,
  isOpen,
  onClose,
}) => {
  const { ethersProvider } = useContext(Web3Context);
  const [split, toggleSplit] = useState(false);
  const [duration, setDuration] = useState(ONEYEAR / 2);
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState<string | undefined>('');
  const onSubmit = async () => {
    if (!ethersProvider) {
      // eslint-disable-next-line no-console
      console.log({ validateError: 'Validation Error' });
      return;
    }
    if (split) {
      const tx = await createStream(
        ethersProvider,
        grantAddress,
        duration,
        amount,
      );
      setTxHash(tx.hash);
    } else {
      const tx = await fundGrant(ethersProvider, grantAddress, amount);
      setTxHash(tx.hash);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay>
        {txHash && (
          <LoadingModal
            title="Funding In Progress"
            txHash={txHash}
            onClose={onClose}
          />
        )}
        {!txHash && (
          <ModalContent
            borderRadius="1rem"
            maxW="40rem"
            mx={{ base: 8, lg: 0 }}
            background="background"
            color="text"
            p={6}
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
                Fund This Grant
              </Text>
              <InputGroup
                maxW="17rem"
                size="lg"
                color="dark"
                background="white"
                border="1px solid #C4C4C4"
                borderRadius="full"
                variant="solid"
              >
                <InputLeftElement
                  mx={1}
                  pointerEvents="none"
                  borderRight="1px solid #C4C4C4"
                >
                  Ξ
                </InputLeftElement>
                <Input
                  background="transparent"
                  mx={2}
                  fontSize="md"
                  placeholder="Amount"
                  pl={16}
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </InputGroup>
              <Text textTransform="uppercase">
                Choose A Distribution Method
              </Text>
              <MethodSelector split={split} toggleSplit={toggleSplit} />
              {!split && (
                <Text letterSpacing="0.3px">
                  Funds will be made available immediately and cannot be
                  withdrawn.
                </Text>
              )}
              {split && (
                <>
                  <Text letterSpacing="0.3px">
                    Funds will be dispersed slowly over time. You can stop the
                    stream at any time.
                  </Text>
                  <Text textTransform="uppercase">Stream Duration</Text>
                  <DurationSelector
                    duration={duration}
                    setDuration={setDuration}
                  />
                </>
              )}
            </VStack>
            <Button
              size="lg"
              colorScheme="green"
              textTransform="uppercase"
              w="100%"
              boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
              letterSpacing="0.115em"
              onClick={onSubmit}
            >
              Fund It
            </Button>
            <ModalCloseButton top={4} right={4} fontSize={16} />
          </ModalContent>
        )}
      </ModalOverlay>
    </Modal>
  );
};
