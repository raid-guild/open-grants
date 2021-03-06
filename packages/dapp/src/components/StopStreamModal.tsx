import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'components/Link';
import { LoadingModal } from 'components/LoadingModal';
import { SuccessModal } from 'components/SuccessModal';
import { Web3Context } from 'contexts/Web3Context';
import { providers } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatValue, getVestedAmount } from 'utils/helpers';
import { revokeStream } from 'utils/streams';
import { Stream } from 'utils/types';

type Props = {
  stream: Stream;
  isOpen: boolean;
  onClose: () => void;
};

export const StopStreamModal: React.FC<Props> = ({
  stream,
  isOpen,
  onClose,
}) => {
  const { ethersProvider } = useContext(Web3Context);
  const [tx, setTx] = useState<providers.TransactionResponse | undefined>();

  const timestamp = Math.floor(new Date().getTime() / 1000);
  const available = stream.funded.sub(getVestedAmount(stream, timestamp));
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async () => {
    if (!ethersProvider || submitting) {
      // eslint-disable-next-line no-console
      console.log({ validateError: 'Validation Error' });
      return;
    }
    setSubmitting(true);
    try {
      setTx(await revokeStream(ethersProvider, stream.id));
    } catch (revokeStreamError) {
      // eslint-disable-next-line no-console
      console.log({ revokeStreamError });
    }
    setSubmitting(false);
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (tx) {
      setLoading(true);
      tx.wait().then(() => setLoading(false));
    }
  }, [tx]);

  const faq =
    useBreakpointValue({
      base: 'Questions? View FAQ',
      sm: 'Questions? View the funding FAQ',
      md: 'Question about streams? View the funding FAQ',
    }) || 'Questions? View FAQ';
  const initialRef = useRef(null);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      initialFocusRef={initialRef}
    >
      <ModalOverlay>
        {tx &&
          (loading ? (
            <LoadingModal
              faq={faq}
              title="Stopping Stream"
              txHash={tx.hash}
              onClose={onClose}
            />
          ) : (
            <SuccessModal
              faq={faq}
              title="Stream Stopped"
              grantAddress={stream.grantAddress}
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
                Stop the Stream
              </Text>
              <Text mb={{ base: 6, sm: 12 }} textAlign="center">
                By stopping the stream, all unvested funds will be returned to
                you.
              </Text>
              <VStack
                mb={{ base: 6, sm: 12 }}
                spacing={4}
                p={8}
                background="white"
                borderRadius="0.5rem"
              >
                <Text fontWeight="500" fontSize="3xl" color="green.500">
                  {`${formatValue(available, 3)} ETH`}
                </Text>
                <Text textTransform="uppercase">Available to Withdraw</Text>
              </VStack>
            </VStack>
            <Button
              size="lg"
              colorScheme="green"
              textTransform="uppercase"
              w="100%"
              boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
              letterSpacing="0.115em"
              onClick={onSubmit}
              ref={initialRef}
              isLoading={submitting}
            >
              Withdraw Funds
            </Button>
            <ModalCloseButton top={4} right={4} fontSize={16} />
          </ModalContent>
        )}
      </ModalOverlay>
    </Modal>
  );
};
