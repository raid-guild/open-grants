import { Text, VStack } from '@chakra-ui/core';
import React from 'react';

export const FAQContent: React.FC = () => {
  return (
    <VStack
      w="100%"
      spacing={8}
      maxW="70rem"
      py="4rem"
      align="stretch"
      px={8}
      color="text"
    >
      <Text fontSize="4xl" fontWeight="800" color="dark">
        About the Project
      </Text>
      <Text mb="2rem">
        Our goal is to create long-term incentives for open-source developers
        working on Ethereum’s roadmap, especially public goods R&D, which are
        essential to Ethereum’s success.
      </Text>
      <Text fontSize="4xl" fontWeight="800" color="dark">
        How It Works
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        What is an Open Grant?
      </Text>
      <Text mb={4}>
        An open grant is a smart contract on Ethereum that forwards any funds
        that it receives to a defined list of recipients. The contract’s
        constructor parameters are grantees (list of recipients), amounts (how
        much to allocate to each grantee) and currency (currently only supports
        ETH).
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
        How can I fund a grant?
      </Text>
      <Text mb={4}>
        You can fund a grant by simply clicking the fund button on a particular
        grant, which will give you the option to set up a stream or send your
        funds all at once. You can send ETH directly to the contract address of
        an open grant with any means that you’d like (other streaming services
        that send ETH should just work).
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        What is a stream? How does it work?
      </Text>
      <Text mb={4}>
        A stream is a simple vesting contract that vests funds over time. If you
        choose to fund a grant by streaming, you’ll need to specify the total
        amount that you’d like to stream and the duration of your stream. The
        funds will be vested incrementally over time and will need to be
        released by calling the withdraw function on the contract. The stream
        creator has the power to “stop” the stream at any time and withdraw the
        unvested portion if they decide that they no longer want to fund the
        grant.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        Can I withdraw my money if I no longer want to fund a grant?
      </Text>
      <Text mb={4}>
        Yes. Stream creators can cancel their streams at any time. The vested
        portion will be sent to the recipients and any unvested amount will be
        returned to the stream creator’s address. If you are unhappy with the
        list of grantees or the allocations of a particular grant, simply create
        a new grant with your own specifications.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        How do I stop a stream?
      </Text>
      <Text mb={4}>
        In the “My Grants” dashboard, you will see all of your current streams.
        Click the “stop” button to see the amount of funds available to withdraw
        and you will see a prompt to complete the action.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        Can I add funds to an existing stream?
      </Text>
      <Text mb={4}>
        Not currently. You should create another stream for the grant.
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
        Can anyone create a grant?
      </Text>
      <Text mb={4}>
        Grants are intended to support contributors working on projects that
        enhance the Ethereum ecosystem. It’s meant for open-source developers,
        designers, researchers, writers – anyone who is contributing to the
        broader Ethereum roadmap.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        How are funds distributed to grantees?
      </Text>
      <Text mb={4}>
        Grantees may receive funds by one-off donations or over a longer
        duration with streams. You can view any grant that you’re a recipient of
        on the “My Grants” page. Anyone can “distribute” vested funds to grant
        recipients by calling the withdraw function on a stream.
      </Text>
    </VStack>
  );
};
