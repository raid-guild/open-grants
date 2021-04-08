import {
  Button,
  Divider,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { CreateGrantModal } from 'components/CreateGrantModal';
import { GranteesInput } from 'components/GranteesInput';
import { GrantTextareaInput, GrantTextInput } from 'components/GrantTextInput';
import { Link } from 'components/Link';
import { CONFIG } from 'config';
import { Web3Context } from 'contexts/Web3Context';
import { utils } from 'ethers';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { URL_REGEX } from 'utils/constants';
import { Grantee } from 'utils/types';

const reduceGrantees = (
  {
    granteeSet,
    isValid,
    total,
  }: { granteeSet: Set<string>; isValid: boolean; total: number },
  { address, amount }: Grantee,
): { granteeSet: Set<string>; isValid: boolean; total: number } => {
  granteeSet.add(address);
  return {
    granteeSet,
    isValid:
      isValid &&
      address !== '' &&
      utils.isAddress(address) &&
      amount !== '' &&
      !Number.isNaN(amount),
    total: total + Number(amount) || 0,
  };
};

export const CreateGrantForm: React.FC = () => {
  const { ethersProvider, isSupportedNetwork } = useContext(Web3Context);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [contactLink, setContactLink] = useState<string>('');
  const [grantees, setGrantees] = useState<Array<Grantee>>([
    { address: '', amount: '', description: '' },
  ]);
  const [numGrantees, setNumGrantees] = useState<number>(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const isFormValid = useMemo(() => {
    const { granteeSet, isValid, total } = grantees.reduce(reduceGrantees, {
      granteeSet: new Set<string>(),
      isValid: true,
      total: 0.0,
    });
    return (
      name !== '' &&
      description !== '' &&
      URL_REGEX.test(link) &&
      URL_REGEX.test(contactLink) &&
      isValid &&
      total === 100.0 &&
      granteeSet.size === grantees.length
    );
  }, [name, description, link, contactLink, grantees]);

  const submitForm = useCallback(async () => {
    if (!ethersProvider) {
      toast({
        status: 'error',
        isClosable: true,
        title: 'Error',
        description: 'Please connect wallet',
      });
    } else if (!isSupportedNetwork) {
      toast({
        status: 'error',
        isClosable: true,
        title: 'Error',
        description: `Please connect wallet to ${CONFIG.network.name}`,
      });
    } else if (!isFormValid) {
      toast({
        status: 'error',
        isClosable: true,
        title: 'Error',
        description: 'Please check input',
      });
    } else {
      onOpen();
    }
  }, [ethersProvider, isSupportedNetwork, isFormValid, onOpen, toast]);

  return (
    <VStack
      w="100%"
      spacing={8}
      maxW="50rem"
      py="4rem"
      align="stretch"
      px={8}
      color="text"
    >
      <Text
        textAlign="center"
        fontSize={{ base: '2rem', md: '3rem' }}
        fontWeight="800"
        color="dark"
        mb={-4}
      >
        Create a Grant
      </Text>
      <Text textAlign="center" mb={4} w="100%">
        {'Request funds for your ETH2 infrastructure project. First time? '}
        <Link
          to="/faq"
          textDecor="underline"
          _hover={{ color: 'green.500' }}
          isExternal
        >
          Read the FAQ
        </Link>
      </Text>
      <GrantTextInput
        title="What is the name of your project?"
        description="Max 48 characters"
        label="Grant Name"
        value={name}
        setValue={setName}
        maxLength={48}
      />
      <GrantTextareaInput
        title="What do you aim to achieve? How will it benefit the Ethereum ecosystem?"
        description="Max 500 characters"
        label="Description"
        value={description}
        setValue={setDescription}
        maxLength={500}
      />
      <GrantTextInput
        title="Where can funders learn about the details of your project? eg: website, blog post, document"
        description="Optional"
        label="Project Link"
        value={link}
        setValue={setLink}
        maxLength={240}
        optional
        isURL
      />
      <GrantTextInput
        title="How can folks contact you? eg: Twitter, Discord, Telegram link"
        description="Optional"
        label="Additional Link"
        value={contactLink}
        setValue={setContactLink}
        maxLength={240}
        optional
        isURL
      />
      <Divider color="gray.100" />
      <GranteesInput
        grantees={grantees}
        setGrantees={setGrantees}
        total={numGrantees}
        setTotal={setNumGrantees}
      />
      <Button
        w="100%"
        variant="outline"
        borderStyle="dotted"
        borderColor="green.500"
        color="green.500"
        fontWeight="500"
        size="lg"
        fontSize="md"
        onClick={() => {
          setNumGrantees(t => t + 1);
          const newGrantees = grantees.slice();
          newGrantees.push({ address: '', amount: '', description: '' });
          setGrantees(newGrantees);
        }}
      >
        Add another grantee
      </Button>
      <Button
        size="lg"
        w="100%"
        colorScheme="green"
        textTransform="uppercase"
        boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
        letterSpacing="0.115em"
        disabled={!isFormValid}
        onClick={submitForm}
      >
        Create Grant
      </Button>
      <CreateGrantModal
        metadata={{
          name,
          description,
          link,
          contactLink,
          grantees,
        }}
        grantees={grantees}
        isOpen={isOpen}
        onClose={onClose}
      />
    </VStack>
  );
};
