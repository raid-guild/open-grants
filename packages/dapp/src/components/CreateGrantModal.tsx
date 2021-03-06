import {
  Button,
  Divider,
  Grid,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { GrantRecipient } from 'components/GrantRecipient';
import { Link } from 'components/Link';
import { LoadingModal } from 'components/LoadingModal';
import { SuccessModal } from 'components/SuccessModal';
import { Web3Context } from 'contexts/Web3Context';
import { providers } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { awaitGrantAddress, createGrant } from 'utils/grants';
import { Grantee, GrantMetadata } from 'utils/types';

type Props = {
  metadata: GrantMetadata;
  grantees: Array<Grantee>;
  isOpen: boolean;
  onClose: () => void;
};

export const CreateGrantModal: React.FC<Props> = ({
  metadata,
  grantees,
  isOpen,
  onClose,
}) => {
  const total = grantees.reduce((t, { amount }) => t + Number(amount), 0);
  const { ethersProvider } = useContext(Web3Context);
  const [tx, setTx] = useState<providers.TransactionResponse | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async () => {
    if (!ethersProvider || submitting) {
      return;
    }
    setSubmitting(true);
    try {
      setTx(
        await createGrant(
          ethersProvider,
          grantees.map(({ address }) => address),
          grantees.map(({ amount }) => amount.toString()),
          metadata,
        ),
      );
    } catch (createGrantError) {
      // eslint-disable-next-line no-console
      console.log({ createGrantError });
    }
    setSubmitting(false);
  };

  const [grantAddress, setGrantAddress] = useState('');
  useEffect(() => {
    if (tx && ethersProvider) {
      awaitGrantAddress(ethersProvider, tx).then(g => setGrantAddress(g));
    }
  }, [tx, ethersProvider]);
  const faq =
    useBreakpointValue({
      base: 'Questions? View FAQ',
      sm: 'Questions? View the grant FAQ',
    }) || 'Questions? View FAQ';
  const initialRef = useRef(null);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      initialFocusRef={initialRef}
      scrollBehavior="inside"
    >
      <ModalOverlay>
        {tx &&
          (grantAddress ? (
            <SuccessModal
              faq={faq}
              title="Grant Created"
              grantAddress={grantAddress}
            />
          ) : (
            <LoadingModal
              faq={faq}
              title="Creating Grant"
              txHash={tx.hash}
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
            fontFamily="body"
          >
            <Link to="/faq" textDecor="underline" isExternal>
              {faq}
            </Link>

            <ModalHeader m="0" p="0" fontWeight="normal">
              <VStack spacing={4} w="100%" p={6} pb="2rem">
                <Text
                  fontSize={{ base: '1.5rem', sm: '2rem', md: '3rem' }}
                  fontWeight="800"
                  textAlign="center"
                  color="dark"
                >
                  Confirm Grant Details
                </Text>
                <Text textAlign="center" fontSize="sm">
                  Please double-check that all information is correct. Once a
                  grant is created it cannot be modified.
                </Text>
                <Divider color="haze" />
              </VStack>
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4} w="100%" p={6} pb="2rem">
                <VStack
                  spacing={2}
                  w="100%"
                  align="stretch"
                  mb={4}
                  color="dark"
                  fontSize="sm"
                >
                  <Text> {metadata.name} </Text>
                  <Text> {metadata.description} </Text>
                  {metadata.link ? (
                    <Link
                      isExternal
                      to={metadata.link}
                      overflowWrap="break-word"
                    >
                      {metadata.link}
                    </Link>
                  ) : (
                    <Text> No link </Text>
                  )}
                  {metadata.contactLink ? (
                    <Link
                      isExternal
                      to={metadata.contactLink}
                      overflowWrap="break-word"
                    >
                      {metadata.contactLink}
                    </Link>
                  ) : (
                    <Text> No contact link </Text>
                  )}
                </VStack>
                <Grid w="100%" gap={4} templateColumns="5fr 1fr" color="text">
                  <HStack>
                    <Text
                      textAlign="left"
                      w="100%"
                      textTransform="uppercase"
                      fontSize="xs"
                    >
                      Grant Recipients
                    </Text>
                  </HStack>
                  <HStack>
                    <Text
                      textAlign="center"
                      w="100%"
                      textTransform="uppercase"
                      fontSize="xs"
                    >
                      Percentage
                    </Text>
                  </HStack>
                </Grid>
                {grantees.map(({ address, amount, description }, id) => (
                  <GrantRecipient
                    account={address}
                    amount={Number(amount)}
                    description={description}
                    total={total}
                    key={id.toString()}
                  />
                ))}
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
                Create Grant
              </Button>
              <ModalCloseButton top={4} right={4} fontSize={16} />
            </ModalBody>
          </ModalContent>
        )}
      </ModalOverlay>
    </Modal>
  );
};
