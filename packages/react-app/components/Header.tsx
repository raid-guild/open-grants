import { Button, Flex, Text, HStack, useDisclosure } from '@chakra-ui/core';
import React, { useContext } from 'react';
import { Web3Context } from 'contexts/Web3Context';
import { NavBar } from 'components/NavBar';

export const Header: React.FC = () => {
    const { account, connectWeb3 } = useContext(Web3Context);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex
            w="100%"
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            py="6"
            px="8"
            background="green.500"
            color="white"
            fontWeight="500"
        >
            <NavBar isOpen={isOpen} onClose={onClose} />
            <HStack spacing={4}>
                <Button
                    variant="link"
                    _focus={{ outline: 'none', border: 'none' }}
                    onClick={onOpen}
                >
                    <svg
                        fill="white"
                        width="1.5rem"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </Button>
                <Text fontSize="1.25rem">Open Grants</Text>
            </HStack>

            <HStack spacing={4}>
                {!account && (
                    <Button
                        onClick={connectWeb3}
                        size="md"
                        textTransform="uppercase"
                        variant="ghost"
                        _hover={{ background: 'green.600' }}
                        color="white"
                    >
                        Sign In
                    </Button>
                )}
                {account && (
                    <Flex justify="center" align="center">
                        <Text>{account}</Text>
                    </Flex>
                )}
            </HStack>
        </Flex>
    );
};
