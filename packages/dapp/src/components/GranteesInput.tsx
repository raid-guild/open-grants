import {
  Button,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ErrorAlert } from 'components/ErrorAlert';
import { GrantTextInput } from 'components/GrantTextInput';
import { utils } from 'ethers';
import { CloseIcon } from 'icons/CloseIcon';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grantee } from 'utils/types';

type Props = {
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  grantees: Array<Grantee>;
  setGrantees: React.Dispatch<React.SetStateAction<Array<Grantee>>>;
};

const reduceTotal = (total: number, { amount }: Grantee): number => {
  return total + Number(amount);
};

export const GranteesInput: React.FC<Props> = ({
  total,
  setTotal,
  grantees,
  setGrantees,
}) => {
  const invalidTotal = useMemo(
    () => grantees.reduce(reduceTotal, 0.0) !== 100.0,
    [grantees],
  );

  const [refresh, setRefresh] = useState(false);

  const distributeEvenly = useCallback(() => {
    const even = Math.floor(1000 / total);
    const newAmounts = new Array(total).fill((even / 10.0).toFixed(1));
    newAmounts[total - 1] = (100.0 - (even / 10.0) * (total - 1)).toFixed(1);
    setGrantees(_grantees => {
      return _grantees.map((_grantee, id) => ({
        ..._grantee,
        amount: newAmounts[id],
      }));
    });
    setRefresh(true);
  }, [setGrantees, total]);

  const removeGrantee = (index: number) => {
    setTotal(t => t - 1);
    const newGrantees = grantees.slice();
    newGrantees.splice(index, 1);
    setGrantees(newGrantees);
    setRefresh(true);
  };

  return (
    <Flex direction="column" w="100%">
      <Flex
        justify="space-between"
        align="center"
        fontSize="sm"
        w="100%"
        p={1}
        mb={2}
      >
        <Text>Who will be the recipients of this grant?</Text>
        <Button
          variant="link"
          color="green.500"
          fontWeight="500"
          fontSize="sm"
          textAlign="right"
          whiteSpace="normal"
          onClick={distributeEvenly}
        >
          Distribute Evenly
        </Button>
      </Flex>
      <VStack spacing={4} w="100%">
        {Array(total)
          .fill(0)
          .map((v, i) => (
            <GranteeInput
              key={v.toString() + i.toString()}
              grantees={grantees}
              setGrantees={setGrantees}
              removeGrantee={removeGrantee}
              index={i}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          ))}
      </VStack>
      {invalidTotal ? (
        <ErrorAlert
          message="Percentages must add up to 100"
          mt={1}
          color="grey"
        />
      ) : null}
    </Flex>
  );
};

type InputProps = {
  grantees: Array<Grantee>;
  setGrantees: React.Dispatch<React.SetStateAction<Array<Grantee>>>;
  removeGrantee: (index: number) => void;
  index: number;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const GranteeInput: React.FC<InputProps> = ({
  grantees,
  setGrantees,
  removeGrantee,
  index: i,
  refresh,
  setRefresh,
}) => {
  const [addressInvalid, setAddressInvalid] = useState(false);
  const [amountInvalid, setAmountInvalid] = useState(false);
  useEffect(() => {
    setAmountInvalid(false);
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh, setRefresh]);
  return (
    <VStack spacing={4} w="100%" mb={4}>
      <Grid
        w="100%"
        templateColumns={{ base: '2fr 1.5fr', sm: '3fr 1.5fr', md: '3fr 1fr' }}
        gridGap={4}
        position="relative"
      >
        <Flex direction="column">
          <Input
            bg="white"
            color="dark"
            size="lg"
            border="none"
            boxShadow="0px 0px 4px #e2e6ee"
            value={grantees[i].address}
            placeholder="Grantee Address"
            name="address"
            isInvalid={addressInvalid}
            onChange={e => {
              setAddressInvalid(!utils.isAddress(e.target.value));
              const newGrantees = grantees.slice();
              newGrantees[i] = { ...newGrantees[i], address: e.target.value };
              setGrantees(newGrantees);
            }}
            fontSize="md"
            maxLength={42}
          />
          {addressInvalid ? (
            <ErrorAlert message="Invalid Address" mt={1} />
          ) : null}
        </Flex>
        <Flex direction="column">
          <InputGroup size="lg">
            <Input
              bg="white"
              color="dark"
              border="none"
              type="number"
              min={0}
              max={100}
              name="amount"
              placeholder="Percentage"
              fontSize="md"
              boxShadow="0px 0px 4px #e2e6ee"
              value={grantees[i].amount}
              onChange={e => {
                const isInvalid =
                  !e.target.value ||
                  Number(e.target.value) <= 0 ||
                  Number(e.target.value) > 100;
                setAmountInvalid(isInvalid);
                const newGrantees = grantees.slice();
                newGrantees[i] = { ...newGrantees[i], amount: e.target.value };
                setGrantees(newGrantees);
              }}
              isInvalid={amountInvalid}
            />
            <InputRightElement
              pointerEvents="none"
              zIndex="initial"
              color="green.500"
              fontSize="md"
            >
              %
            </InputRightElement>
          </InputGroup>
          {amountInvalid ? (
            <ErrorAlert message="Invalid Amount" mt={1} />
          ) : null}
        </Flex>
        {i > 0 && (
          <CloseIcon
            position="absolute"
            right="-2rem"
            top="50%"
            transform="translateY(-50%)"
            cursor="pointer"
            transition="0.25s"
            color="text"
            _hover={{ color: 'green.500' }}
            boxSize="1.25rem"
            onClick={() => removeGrantee(i)}
          />
        )}
      </Grid>
      <GrantTextInput
        label="Grantee Description"
        value={grantees[i].description}
        setValue={desc => {
          const newGrantees = grantees.slice();
          newGrantees[i] = { ...newGrantees[i], description: desc };
          setGrantees(newGrantees);
        }}
        maxLength={140}
        optional
      />
    </VStack>
  );
};
