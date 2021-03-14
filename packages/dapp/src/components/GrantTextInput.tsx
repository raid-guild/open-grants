import { Flex, Input, Text } from '@chakra-ui/react';
import { ErrorAlert } from 'components/ErrorAlert';
import React, { useState } from 'react';
import { URL_REGEX } from 'utils/constants';

type Props = {
  title: string;
  description: string;
  label: string;
  value: string;
  maxLength: number;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  optional?: boolean;
  isURL?: boolean;
};

export const GrantTextInput: React.FC<Props> = ({
  title,
  description = '',
  label,
  value,
  setValue,
  maxLength,
  optional = false,
  isURL = false,
}) => {
  const [invalid, setInvalid] = useState(false);

  return (
    <Flex direction="column" w="100%">
      <Flex justify="space-between" align="center" fontSize="sm" w="100%" p={1}>
        <Text>{title}</Text>
        <Text fontSize="xs" align="right" pl={4}>
          {description}
        </Text>
      </Flex>
      <Input
        w="100%"
        size="lg"
        border="none"
        isInvalid={invalid}
        value={value}
        placeholder={label}
        onChange={e => {
          if (isURL) {
            setInvalid(!URL_REGEX.test(e.target.value));
          } else if (!optional) {
            setInvalid(!e.target.value);
          }
          setValue(e.target.value);
        }}
        fontSize="md"
        maxLength={maxLength}
        color="dark"
        boxShadow="0px 0px 4px #e2e6ee"
      />
      {invalid ? (
        <ErrorAlert
          message={isURL ? 'Invalid URL' : 'Cannot be empty'}
          mt={1}
        />
      ) : null}
    </Flex>
  );
};
