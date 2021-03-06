import { Flex, Grid, HStack, Text } from '@chakra-ui/react';
import { GrantRecipient } from 'components/GrantRecipient';
import { Link } from 'components/Link';
import React from 'react';
import { Grantee } from 'utils/types';

type Props = {
  grantAddress: string;
  grantees: Array<Grantee>;
  page?: boolean;
};

export const GrantRecipients: React.FC<Props> = ({
  grantAddress,
  grantees: oldGrantees,
  page = false,
}) => {
  const grantees = oldGrantees.sort((a, b) => {
    if (a.amount < b.amount) return 1;
    if (a.amount === b.amount) return 0;
    return -1;
  });

  const total = grantees.reduce((t, { amount }) => t + Number(amount), 0.0);
  const displayGrantees = page ? grantees : grantees.slice(0, 5);
  return (
    <Flex
      id="recipients"
      w="100%"
      maxW="50rem"
      background={page ? 'transparent' : 'white'}
      boxShadow={page ? 'none' : '0px 4px 4px rgba(114, 125, 129, 0.25)'}
      borderRadius={page ? '0' : '0.5rem'}
      p={{ base: '6', md: '8' }}
      position="relative"
      color="text"
      direction="column"
      align="flex-start"
    >
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        mb={4}
        direction={page ? 'column' : 'row'}
      >
        <Text
          color="dark"
          fontSize={page ? { base: '1.5rem', md: '2rem' } : 'xl'}
          fontWeight={page ? '800' : 'bold'}
        >
          Grant Recipients
        </Text>
        <Text fontSize="sm">
          {`${grantees.length} ${
            grantees.length === 1 ? 'Recipient' : 'Recipients'
          }`}
        </Text>
      </Flex>
      <Grid w="100%" gap={4} templateColumns="5fr 1fr" color="text">
        <HStack />
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
      {displayGrantees.length > 0 ? (
        displayGrantees.map(({ address, amount, description }) => (
          <GrantRecipient
            account={address}
            amount={Number(amount)}
            description={description}
            total={total}
            key={address}
          />
        ))
      ) : (
        <Flex
          align="center"
          justify="center"
          mt={2}
          p={3}
          background="haze"
          minW="100%"
          w="100%"
          height="100%"
        >
          <Text textAlign="center">No Recipients found</Text>
        </Flex>
      )}
      {!page && grantees.length > 5 && (
        <Flex w="100%" justify="space-between" align="center" mt={4}>
          <Text fontSize="sm">{`+ ${grantees.length - 5} more`}</Text>
          <Link
            to={`/grant/${grantAddress}/recipients`}
            textDecor="underline"
            color="green.500"
            fontWeight="500"
            fontSize="sm"
          >
            View all recipients
          </Link>
        </Flex>
      )}
    </Flex>
  );
};
