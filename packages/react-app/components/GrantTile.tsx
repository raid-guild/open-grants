import { Button, Text, VStack } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { ParsedGrant } from 'utils/grants';

type Props = {
    grant: ParsedGrant;
};
export const GrantTile: React.FC<Props> = ({ grant }) => {
    if (!grant) return null;
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
                <Button
                    bg="background"
                    colorScheme="gray"
                    textTransform="uppercase"
                >
                    Details
                </Button>
            </NextLink>
        </VStack>
    );
};
