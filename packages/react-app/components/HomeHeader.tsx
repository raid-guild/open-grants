import React from 'react';
import { Image, Text,  Button, VStack } from '@chakra-ui/core';

import EthereumImage from '../assets/ethereum.svg';

export const HomeHeader: React.FC = () => {
    return (
        <VStack
            py={10}
            spacing={5}
            w="100%"
            justify="space-around"
            color="white"
            background="green.500"
        >
            <Text fontSize="3rem" fontWeight="800">Open Grants</Text>
            <Image src={EthereumImage} />
            <Text>
                Together we empower developers to build the next generation of
                ETH
            </Text>
            <Button borderRadius="full" variant="outline" _hover={{background:"green.600"}}>
                Read the FAQ
            </Button>
        </VStack>
    );
};
