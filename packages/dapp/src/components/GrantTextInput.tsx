import { Flex, Input, Text } from '@chakra-ui/core';
import React, { useState } from 'react';

type Props = {
  title: string;
  description: string;
  label: string;
  value: string;
  maxLength: number;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  optional?: boolean;
};

export const GrantTextInput: React.FC<Props> = ({
  title,
  description = '',
  label,
  value,
  setValue,
  maxLength,
  optional = false,
}) => {
  const [invalid, setInvalid] = useState(false);
  // TODO add a check for validating if links are valid
  return (
    <Flex direction="column" w="100%">
      <Flex justify="space-between" align="center" fontSize="sm" w="100%" p={1}>
        <Text>{title}</Text>
        <Text>{description}</Text>
      </Flex>
      <Input
        w="100%"
        size="lg"
        border="none"
        isInvalid={invalid}
        value={value}
        placeholder={label}
        onChange={e => {
          if (!optional) {
            setInvalid(!e.target.value);
          }
          setValue(e.target.value);
        }}
        fontSize="md"
        maxLength={maxLength}
      />
    </Flex>
  );
};
