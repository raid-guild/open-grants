import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Image,
  Link,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import DiscordIcon from 'assets/discord.svg';
import GithubIcon from 'assets/github.svg';
import TwitterIcon from 'assets/twitter.svg';
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
      <Flex>
        <Text fontSize="4xl" fontWeight="800" color="dark">
          About the Project
        </Text>
        <Spacer />
        <Flex direction={{ base: 'column', sm: 'row' }}>
          <Link
            href="https://discord.gg/4jTbTBgvBs"
            isExternal
            px=".5rem"
            py={{ base: '.5rem', sm: '0' }}
          >
            <Image src={DiscordIcon} alt="Discord icon" w="2rem" />
          </Link>
          <Link
            href="https://twitter.com/ethopengrants"
            isExternal
            px=".5rem"
            py={{ base: '.5rem', sm: '0' }}
          >
            <Image src={TwitterIcon} alt="Twitter icon" w="2rem" />
          </Link>
          <Link
            href="https://github.com/raid-guild/open-grants"
            isExternal
            px=".5rem"
            py={{ base: '.5rem', sm: '0' }}
          >
            <Image src={GithubIcon} alt="Github icon" w="2rem" />
          </Link>
        </Flex>
      </Flex>
      <Text>
        Our goal is to create long-term incentives for open-source developers
        working on Ethereum’s roadmap, especially public goods R&D, which are
        essential to Ethereum’s success.
      </Text>
      <Text fontSize="xl" fontWeight="600" color="dark">
        What is an Open Grant?
      </Text>
      <Text mb={6}>
        An open grant is a smart contract on Ethereum that forwards any funds
        that it receives to a defined list of recipients. The contract’s
        constructor parameters are grantees (list of recipients), amounts (how
        much to allocate to each grantee) and currency (currently only supports
        ETH).
      </Text>
      <Text fontSize="4xl" fontWeight="800" color="dark">
        How It Works
      </Text>
      <Text
        textTransform="uppercase"
        fontStyle="italic"
        fontSize="xl"
        letterSpacing="1.3px"
        pl={4}
      >
        For Funders
      </Text>

      <Accordion borderColor="white">
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              How can I fund a grant?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            You can fund a grant by simply clicking the fund button on a
            particular grant, which will give you the option to set up a stream
            or send your funds all at once. You can send ETH directly to the
            contract address of an open grant with any means that you’d like
            (other streaming services that send ETH should just work).
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              What is a stream? How does it work?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            A stream is a simple vesting contract that vests funds over time. If
            you choose to fund a grant by streaming, you’ll need to specify the
            total amount that you’d like to stream and the duration of your
            stream. The funds will be vested incrementally over time and will
            need to be released by calling the withdraw function on the
            contract. The stream creator has the power to “stop” the stream at
            any time and withdraw the unvested portion if they decide that they
            no longer want to fund the grant.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              Can I withdraw my money if I no longer want to fund a grant?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            Yes. Stream creators can cancel their streams at any time. The
            vested portion will be sent to the recipients and any unvested
            amount will be returned to the stream creator’s address. If you are
            unhappy with the list of grantees or the allocations of a particular
            grant, simply create a new grant with your own specifications.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              How do I stop a stream?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            In the “My Grants” dashboard, you will see all of your current
            streams. Click the “stop” button to see the amount of funds
            available to withdraw and you will see a prompt to complete the
            action.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              Can I add funds to an existing stream?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            Not currently. You should create another stream for the grant.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              Are the smart contracts audited?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            <Link href="https://sigmaprime.io" isExternal>
              Sigma Prime
            </Link>
            &nbsp;audited both the payment stream contract and the grant
            contract (payment splitter). There were no major vulnerabilities
            found. This is not a guarantee that the contracts are free from
            vulnerabilities.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Text
        textTransform="uppercase"
        fontStyle="italic"
        fontSize="xl"
        letterSpacing="1.3px"
        pl={4}
      >
        For Grantees
      </Text>
      <Accordion borderColor="white">
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              Who is this for? Can anyone create a grant?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            Grants are intended to support contributors working on projects that
            enhance the Ethereum ecosystem. It’s meant for open-source
            developers, designers, researchers, writers – anyone who is
            contributing to the broader Ethereum roadmap.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              How should I create a grant?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            Once logged in, open the menu and click “Create Grant”. Complete the
            form, keeping in mind that once a grant is created these details
            cannot be changed. For project description, provide a high-level
            overview of the project, specifically how this grant will benefit
            the Ethereum ecosystem. For the project link we recommend you point
            to a webpage, blog post or document that covers things like scope of
            the project, goals, timeline, and funding goals. Once you’re ready,
            click “Create Grant” which will initiate a transaction to complete
            the action. Note that once a grant is created, its details cannot be
            modified.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              How are funds distributed to grantees?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            Grantees may receive funds by one-off donations or over a longer
            duration with streams. You can view any grant that you’re a
            recipient of on the “My Grants” page to see the available balance.
            Anyone can distribute vested funds to grant recipients by clicking
            the “distribute” button and following the prompts, or by calling the
            withdraw function on a stream.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              How can I get my grant featured on the discover page?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            Submit a request using&nbsp;
            <Link
              href="https://github.com/raid-guild/open-grants/issues/new?assignees=&labels=&template=add-featured-grant.md&title=Add+Featured+Grant"
              isExternal
            >
              this template on our Github repo.
            </Link>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Text
        textTransform="uppercase"
        fontStyle="italic"
        fontSize="xl"
        letterSpacing="1.3px"
        pl={4}
      >
        For Community
      </Text>

      <Accordion borderColor="white">
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              How can I add a profile photo and name to my account?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            Create a&nbsp;
            <Link href="https://3box.io/hub" isExternal>
              3Box
            </Link>
            &nbsp;profile for the address you use to sign in to OpenGrants.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              How can I get in contact with the Open Grants team?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            If you want to ask a question, report a bug, request a feature, or
            just say hi...&nbsp;
            <Link href="https://discord.gg/4jTbTBgvBs" isExternal>
              hop into our community Discord!
            </Link>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box
              flex="1"
              textAlign="left"
              fontSize="xl"
              fontWeight="600"
              color="dark"
              py={4}
            >
              How can I contribute to the project?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={6}>
            If you would like to submit an issue or contribute code,&nbsp;
            <Link href="https://github.com/raid-guild/open-grants" isExternal>
              check out our project on Github!
            </Link>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};
