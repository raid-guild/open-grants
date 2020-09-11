import { Flex } from '@chakra-ui/core';
import React from 'react';

import { Header } from './Header';

export const Layout: React.FC = ({ children }) => (
    <Flex
        p={0}
        m={0}
        overflowX="hidden"
        fontFamily="body"
        w="100%"
        minH="100vh"
        align="center"
        direction="column"
        background="background"
        position="relative"
    >
        <Header />
        <Flex
            flex={1}
            align="center"
            justify="flex-start"
            direction="column"
            w="100%"
            h="100%"
            position="relative"
        >
            {children}
        </Flex>
    </Flex>
);
