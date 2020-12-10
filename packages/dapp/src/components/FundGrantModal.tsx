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
  useBreakpointValue,
  VStack,
} from '@chakra-ui/core';
import { DurationSelector } from 'components/DurationSelector';
import { Link } from 'components/Link';
import { LoadingModal } from 'components/LoadingModal';
import { MethodSelector } from 'components/MethodSelector';
import { SuccessModal } from 'components/SuccessModal';
import { Web3Context } from 'contexts/Web3Context';
import { providers } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ONEMONTH } from 'utils/constants';
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
  const [duration, setDuration] = useState(ONEMONTH * 6);
  const [amount, setAmount] = useState('');
  const [tx, setTx] = useState<providers.TransactionResponse | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async () => {
    if (!ethersProvider || submitting) {
      // eslint-disable-next-line no-console
      console.log({ validateError: 'Validation Error' });
      return;
    }
    setSubmitting(true);
    try {
      if (split) {
        setTx(
          await createStream(ethersProvider, grantAddress, duration, amount),
        );
      } else {
        setTx(await fundGrant(ethersProvider, grantAddress, amount));
      }
    } catch (fundingError) {
      // eslint-disable-next-line no-console
      console.log({ fundingError });
    }
    setSubmitting(false);
  };
  const [loading, setLoading] = useState(false);
  const [isValid, setValid] = useState(false);
  useEffect(() => {
    if (tx) {
      setLoading(true);
      tx.wait().then(() => setLoading(false));
    }
  }, [tx]);

  useEffect(() => {
    const valid = Number(amount) > 0 && duration > 0;
    setValid(valid);
  }, [amount, duration, setValid]);

  const faq = useBreakpointValue({
    base: 'Questions? View FAQ',
    sm: 'Questions? View the funding FAQ',
  });
  const inputRef = useRef(null);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      initialFocusRef={inputRef}
    >
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
            />
          ))}
        {!tx && (
          <ModalContent
            borderRadius="1rem"
            maxW="40rem"
            mx={{ base: 8, lg: 0 }}
            background="background"
            color="text"
            fontFamily="body"
            p={6}
          >
            <Link to="/faq" textDecor="underline" isExternal>
              {faq}
            </Link>

            <VStack spacing={4} w="100%" py={6}>
              <Text
                fontSize={{ base: '1.5rem', sm: '2rem', md: '3rem' }}
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
                  fontFamily="sans-serif"
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
                  ref={inputRef}
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
              disabled={!isValid}
              w="100%"
              boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
              letterSpacing="0.115em"
              onClick={onSubmit}
              isLoading={submitting}
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
