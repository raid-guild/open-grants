import React from 'react';
import { Text, VStack, Button } from '@chakra-ui/core';
import NextLink from 'next/link';

export const GrantTile: React.FC = ({ grant }) => {
    return (
        <VStack
            style={{ backdropFilter: 'blur(7px)' }}
            rounded="lg"
            py="6"
            px="4"
            spacing="6"
            background="white"
        >
            <Text fontWeight="600">{grant.name}</Text>
            <NextLink
                as={`/grant/${grant.grantAddress}`}
                href="grant/[username]"
            >
                <Button bg="background" color="grey" textTransform="uppercase">
                    Details
                </Button>
            </NextLink>
        </VStack>
    );
};
