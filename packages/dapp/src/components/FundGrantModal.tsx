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
import { SuccessModal } from 'components/SuccessModal';
import { Web3Context } from 'contexts/Web3Context';
import { providers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
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
  const [tx, setTx] = useState<providers.TransactionResponse | undefined>();
  const onSubmit = async () => {
    if (!ethersProvider) {
      // eslint-disable-next-line no-console
      console.log({ validateError: 'Validation Error' });
      return;
    }
    if (split) {
      setTx(await createStream(ethersProvider, grantAddress, duration, amount));
    } else {
      setTx(await fundGrant(ethersProvider, grantAddress, amount));
    }
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (tx) {
      setLoading(true);
      tx.wait().then(() => setLoading(false));
    }
  }, [tx]);

  const faq = 'Questions? View the funding FAQ';
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay>
        {tx &&
          (loading ? (
            <LoadingModal
              faq={faq}
              title="Funding In Progress"
              txHash={tx.hash}
              onClose={onClose}
            />
          ) : (
            <SuccessModal
              faq={faq}
              title="Grant Funded"
              grantAddress={grantAddress}
              onClose={onClose}
            />
          ))}
        {!tx && (
          <ModalContent
            borderRadius="1rem"
            maxW="40rem"
            mx={{ base: 8, lg: 0 }}
            background="background"
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
                Fund This Grant
              </Text>
              <InputGroup
                maxW="17rem"
                size="lg"
                color="dark"
                background="white"
                borderRadius="full"
                variant="solid"
                boxShadow="0px 0px 4px #e2e6ee"
              >
                <InputLeftElement
                  mx={1}
                  pointerEvents="none"
                  borderRight="1px solid #EAECEF"
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
              <Text textTransform="uppercase">Distribution Method</Text>
              <MethodSelector split={split} toggleSplit={toggleSplit} />
              {!split && (
                <Text letterSpacing="0.3px" fontSize="sm" textAlign="center">
                  Funds will be made available immediately and cannot be
                  withdrawn.
                </Text>
              )}
              {split && (
                <>
                  <Text letterSpacing="0.3px" fontSize="sm" textAlign="center">
                    Funds will be dispersed slowly over time. You can stop the
                    stream at any point and withdraw unvested funds.
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
