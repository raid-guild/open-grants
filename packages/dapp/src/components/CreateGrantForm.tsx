import { Button, Divider, Text, useDisclosure, VStack } from '@chakra-ui/core';
import { CreateGrantModal } from 'components/CreateGrantModal';
import { GranteesInput } from 'components/GranteesInput';
import { GrantTextInput } from 'components/GrantTextInput';
import { Link } from 'components/Link';
import { Web3Context } from 'contexts/Web3Context';
import React, { useContext, useState } from 'react';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const submitForm = async () => {
    const isValid =
      name &&
      description &&
      grantees.reduce(reduceEmpty, true) &&
      amounts.reduce(reduceEmpty, true) &&
      amounts.reduce(reduceTotal, 0.0) === 100.0;
    if (!ethersProvider || !isValid) {
      // eslint-disable-next-line no-console
      console.log({ validateError: 'Validation Error' });
      return;
    }
    onOpen();
  };
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
        <Link to="/faq" textDecor="underline" _hover={{ color: 'green.500' }}>
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
      <GrantTextInput
        title="What do you aim to achieve?"
        description="Max 240 characters"
        label="Description"
        value={description}
        setValue={setDescription}
        maxLength={240}
      />
      <GrantTextInput
        title="Where can folks learn more about what you’re working on?"
        description="Optional"
        label="Project Link"
        value={link}
        setValue={setLink}
        maxLength={240}
        optional
        isURL
      />
      <GrantTextInput
        title="How can folks contact you?"
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
        amounts={amounts}
        setAmounts={setAmounts}
        total={total}
        setTotal={setTotal}
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
          setTotal(t => t + 1);
          const newGrantees = grantees.slice();
          newGrantees.push('');
          setGrantees(newGrantees);
          const newAmounts = amounts.slice();
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
        boxShadow="0px 4px 4px rgba(61, 82, 71, 0.25)"
        letterSpacing="0.115em"
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
        }}
        grantees={grantees}
        amounts={amounts}
        isOpen={isOpen}
        onClose={onClose}
      />
    </VStack>
  );
};
