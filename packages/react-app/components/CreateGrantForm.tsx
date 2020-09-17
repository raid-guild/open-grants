import { Text, VStack, Divider, Button } from '@chakra-ui/core';
import React, { useState, useContext } from 'react';
import { Link } from './Link';
import { TextInput } from './TextInput';
import { GranteesInput } from './GranteesInput';
import { uploadMetadata } from 'utils/ipfs';
import { createGrant } from 'utils/grants';
import { Web3Context } from 'contexts/Web3Context';

const reduceEmpty = (isValid: boolean, str: string): boolean => {
  return isValid && str !== '';
};

const reduceTotal = (total: number, str: string): number => {
  return total + Number(str);
};

export const CreateGrantForm: React.FC = () => {
  const { ethersProvider } = useContext(Web3Context);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [contactLink, setContactLink] = useState<string>('');
  const [grantees, setGrantees] = useState<Array<string>>(['']);
  const [amounts, setAmounts] = useState<Array<string>>(['']);
  const [total, setTotal] = useState<number>(1);
  const submitForm = async () => {
    const isValid =
      grantees.reduce(reduceEmpty, true) &&
      amounts.reduce(reduceEmpty, true) &&
      100.0 === amounts.reduce(reduceTotal, 0.0);
    if (!ethersProvider || !isValid) {
      // eslint-disable-next-line no-console
      console.log({ validateError: 'Validation Error' });
      return;
    }
    const ipfsHash = await uploadMetadata({
      name,
      description,
      link,
      contactLink,
    });
    await createGrant(ethersProvider, grantees, amounts, ipfsHash);
  };
  return (
    <VStack
      w="100%"
      spacing={8}
      maxW="45rem"
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
      <Text textAlign="center" mb={4}>
        {'Request funds for your ETH2 infrastructure project. First time? '}
        <Link href="faq" textDecor="underline" _hover={{ color: 'green.500' }}>
          Read the FAQ
        </Link>
      </Text>
      <TextInput
        title="What is the name of your project?"
        description="48 characters max"
        label="Grant Name"
        value={name}
        setValue={setName}
        maxLength={48}
      />
      <TextInput
        title="What do you aim to achieve?"
        description="240 characters max"
        label="Description"
        value={description}
        setValue={setDescription}
        maxLength={240}
      />
      <TextInput
        title="Where can folks learn more about what you’re working on?"
        description="Optional"
        label="Project Link"
        value={link}
        setValue={setLink}
        maxLength={240}
      />
      <TextInput
        title="How can folks contact you?"
        description="Optional"
        label="Additional Link"
        value={contactLink}
        setValue={setContactLink}
        maxLength={240}
      />
      <Divider color="gray.100" />
      <GranteesInput
        grantees={grantees}
        setGrantees={setGrantees}
        amounts={amounts}
        setAmounts={setAmounts}
        total={total}
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
        mb={8}
        onClick={() => {
          setTotal(t => t + 1);
          let newGrantees = grantees.slice();
          newGrantees.push('');
          setGrantees(newGrantees);
          let newAmounts = amounts.slice();
          newAmounts.push('');
          setAmounts(newAmounts);
        }}
      >
        Add another grantee
      </Button>
      <Button
        size="lg"
        w="100%"
        colorScheme="green"
        textTransform="uppercase"
        letterSpacing="2px"
        onClick={submitForm}
      >
        Create Grant
      </Button>
    </VStack>
  );
};
