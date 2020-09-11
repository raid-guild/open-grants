import { Button, Text, VStack } from '@chakra-ui/core';
import React from 'react';
import { ParsedGrant } from 'utils/grants';

type Props = {
    grant: ParsedGrant;
}
export const GrantHeader: React.FC<Props> = ({ grant }) => {
    return (
        <VStack
            py={10}
            spacing={5}
            w="100%"
            justify="space-around"
            color="white"
            background="green.500"
        >
            <Text fontSize="3rem" fontWeight="800">
                {grant.name}
            </Text>
            <Text>{grant.description}</Text>
            <Button
                borderRadius="full"
                variant="outline"
                _hover={{ background: 'green.600' }}
            >
                Fund this grant
            </Button>
        </VStack>
    );
};
