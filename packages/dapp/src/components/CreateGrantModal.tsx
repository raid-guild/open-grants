import {
  Button,
  Grid,
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/core';
import { GrantRecipient } from 'components/GrantRecipient';
import { Link } from 'components/Link';
import { LoadingModal } from 'components/LoadingModal';
import { SuccessModal } from 'components/SuccessModal';
import { Web3Context } from 'contexts/Web3Context';
import { providers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { awaitGrantAddress, createGrant } from 'utils/grants';
import { Metadata } from 'utils/ipfs';

type Props = {
  metadata: Metadata;
  grantees: Array<string>;
  amounts: Array<string>;
  isOpen: boolean;
  onClose: () => void;
};

export const CreateGrantModal: React.FC<Props> = ({
  metadata,
  grantees,
  amounts,
  isOpen,
  onClose,
}) => {
  const total = amounts.reduce((t, a) => t + Number(a), 0);
  const { ethersProvider } = useContext(Web3Context);
  const [tx, setTx] = useState<providers.TransactionResponse | undefined>();
  const onSubmit = async () => {
    if (!ethersProvider) {
      // eslint-disable-next-line no-console
      console.log({ validateError: 'Validation Error' });
      return;
    }
    setTx(await createGrant(ethersProvider, grantees, amounts, metadata));
  };
  const [grantAddress, setGrantAddress] = useState('');
  useEffect(() => {
    if (tx && ethersProvider) {
      awaitGrantAddress(ethersProvider, tx).then(g => setGrantAddress(g));
    }
  }, [tx, ethersProvider]);
  const faq = 'Questions about grants? View the funding FAQ';
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay>
        {tx &&
          (grantAddress ? (
            <SuccessModal
              faq={faq}
              title="Grant Created"
              grantAddress={grantAddress}
              onClose={onClose}
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
          >
            <Link to="/faq" textDecor="underline">
              {faq}
            </Link>

            <VStack spacing={4} w="100%" p={6} pb="4.5rem">
              <Text
                fontSize={{ base: '2rem', md: '3rem' }}
                fontWeight="800"
                textAlign="center"
                color="dark"
              >
                Fund This Grant
              </Text>
              <VStack
                spacing={2}
                w="100%"
                fontSize="sm"
                align="stretch"
                mb={12}
              >
                <Text> {metadata.name} </Text>
                <Text> {metadata.description} </Text>
                <Text> {metadata.link ? metadata.link : 'No link'} </Text>
                <Text>
                  {metadata.contactLink
                    ? metadata.contactLink
                    : 'No contact link'}
                </Text>
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
              {grantees.map((grantee, id) => (
                <GrantRecipient
                  account={grantee}
                  amount={Number(amounts[id])}
                  total={total}
                  key={grantee}
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
            >
              Create Grant
            </Button>
            <ModalCloseButton top={4} right={4} fontSize={16} />
          </ModalContent>
        )}
      </ModalOverlay>
    </Modal>
  );
};