import { Text, TextProps } from '@chakra-ui/react';
import React from 'react';

export const ErrorAlert: React.FC<{ message: string } & TextProps> = ({
  message,
  ...props
}) => (
  <Text
    w="100%"
    color="red.500"
    fontWeight="500"
    textAlign="right"
    fontSize="xs"
    {...props}
  >
    {message}
  </Text>
);
