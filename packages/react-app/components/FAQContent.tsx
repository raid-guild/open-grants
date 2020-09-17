import { Text, VStack } from '@chakra-ui/core';
import React from 'react';

export const FAQContent: React.FC = () => {
  return (
    <VStack
      w="100%"
      spacing={8}
      maxW="70rem"
      py="6rem"
      align="stretch"
      px={8}
      color="text"
    >
      <Text fontSize="4xl" fontWeight="800" color="dark">
        About the Project
      </Text>
      <Text mb="5rem">
        Netus et malesuada fames ac turpis egestas maecenas pharetra. Eros donec
        ac odio tempor orci dapibus ultrices in iaculis. Vulputate mi sit amet
        mauris. Tristique et egestas quis ipsum suspendisse ultrices. Nulla at
        volutpat diam ut. Dignissim sodales ut eu sem integer. Lectus magna
        fringilla urna porttitor rhoncus dolor purus. In hendrerit gravida
        rutrum quisque non tellus orci ac.
      </Text>
      <Text fontSize="4xl" fontWeight="800" color="dark">
        How It Works
      </Text>
      <Text
        textTransform="uppercase"
        fontStyle="italic"
        fontSize="2xl"
        letterSpacing="1.3px"
      >
        For Funders
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        What are the different funding options? What’s a stream?
      </Text>
      <Text mb={4}>
        Netus et malesuada fames ac turpis egestas maecenas pharetra. Eros donec
        ac odio tempor orci dapibus ultrices in iaculis. Vulputate mi sit amet
        mauris.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        Can I withdraw my money if I decide I no longer want to fund the grant?
      </Text>
      <Text mb={4}>
        Ornare arcu dui vivamus arcu felis. Adipiscing vitae proin sagittis
        nisl. Turpis massa tincidunt dui ut ornare lectus sit amet est. Amet
        dictum sit amet justo donec enim.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        How do I stop a stream?
      </Text>
      <Text mb={4}>
        Netus et malesuada fames ac turpis egestas maecenas pharetra. Eros donec
        ac odio tempor orci dapibus ultrices in iaculis. Vulputate mi sit amet
        mauris.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        How can I add funds to an existing stream?
      </Text>
      <Text mb={4}>
        Ornare arcu dui vivamus arcu felis. Adipiscing vitae proin sagittis
        nisl. Turpis massa tincidunt dui ut ornare lectus sit amet est. Amet
        dictum sit amet justo donec enim.
      </Text>
      <Text
        textTransform="uppercase"
        fontStyle="italic"
        fontSize="2xl"
        letterSpacing="1.3px"
      >
        For Grantees
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        What is a grant?
      </Text>
      <Text mb={4}>
        Netus et malesuada fames ac turpis egestas maecenas pharetra. Eros donec
        ac odio tempor orci dapibus ultrices in iaculis. Vulputate mi sit amet
        mauris.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        How are funds distributed to grantees?
      </Text>
      <Text mb={4}>
        Ornare arcu dui vivamus arcu felis. Adipiscing vitae proin sagittis
        nisl. Turpis massa tincidunt dui ut ornare lectus sit amet est. Amet
        dictum sit amet justo donec enim.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        Can anyone create a grant?
      </Text>
      <Text mb={4}>
        Netus et malesuada fames ac turpis egestas maecenas pharetra. Eros donec
        ac odio tempor orci dapibus ultrices in iaculis. Vulputate mi sit amet
        mauris.
      </Text>
    </VStack>
  );
};
