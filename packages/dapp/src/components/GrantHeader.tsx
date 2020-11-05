import {
  Button,
  Flex,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/core';
import HeaderBG from 'assets/header.jpg';
import { AmountDisplay } from 'components/AmountDisplay';
import { FundGrantModal } from 'components/FundGrantModal';
import { Link } from 'components/Link';
import { CopyIcon } from 'icons/CopyIcon';
import React from 'react';
import { copyToClipboard,formatValue } from 'utils/helpers';
import { Grant } from 'utils/types';

type Props = {
  grant: Grant;
};
export const GrantHeader: React.FC<Props> = ({ grant }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const grantAddressDisplay = useBreakpointValue({
    base: `${grant.id.slice(0, 12).toUpperCase()}...`,
    sm: `${grant.id.slice(0, 24).toUpperCase()}...`,
    md: grant.id,
  });

  return (
    <VStack
      px="2rem"
      w="100%"
      color="white"
      bgImage={`url(${HeaderBG})`}
      bgSize="cover"
      bgRepeat="no-repeat"
      backgroundAttachment="fixed"
      pt="6rem"
      pb="1rem"
    >
      <Link
        color="white"
        fontSize="clamp(1.5rem, 5vw, 3rem)"
        fontWeight="800"
        textAlign="center"
        to={`/grant/${grant.id}`}
        maxW="35rem"
        whiteSpace="pre-wrap"
      >
        {grant.name}
      </Link>
      <Text maxW="55rem" w="auto">
        {grant.description}
      </Text>

      <Link
        to={grant.link}
        isExternal
        mb={4}
        overflowWrap="break-word"
        wordBreak="break-word"
      >
        {grant.link}
      </Link>
      <Flex mb={8} align="center">
        <Text textTransform="uppercase">{grantAddressDisplay}</Text>
        {document.queryCommandSupported('copy') && (
          <Button
            ml={4}
            onClick={() => copyToClipboard(grant.id.toLowerCase())}
            variant="ghost"
            color="white"
            _hover={{ background: 'black20' }}
            h="auto"
            w="auto"
            minW="2"
            p={2}
          >
            <CopyIcon boxSize={4} />
          </Button>
        )}
      </Flex>
      <Button
        borderRadius="full"
        variant="solid"
        color="dark"
        background="cyan.100"
        _hover={{ background: 'cyan.400' }}
        size="lg"
        fontWeight="500"
        px={10}
        onClick={onOpen}
        mb={12}
      >
        Fund this grant
      </Button>
      <FundGrantModal
        grantAddress={grant.id}
        isOpen={isOpen}
        onClose={onClose}
      />
      <SimpleGrid
        columns={4}
        spacing={4}
        letterSpacing="0.3px"
        justifySelf="flex-end"
        mb={8}
      >
        <a href="#funders">
          <AmountDisplay
            amount={grant.funders ? grant.funders.length.toString() : '0'}
            label={
              grant.funders && grant.funders.length === 1 ? 'Funder' : 'Funders'
            }
          />
        </a>
        <a href="#details">
          <AmountDisplay
            amount={`${formatValue(grant.pledged)} ETH`}
            label="Pledged"
          />
        </a>
        <a href="#details">
          <AmountDisplay
            amount={`${formatValue(grant.funded)} ETH`}
            label="Paid Out"
          />
        </a>
        <a href="#recipients">
          <AmountDisplay
            amount={grant.grantees.length.toString()}
            label={grant.grantees.length === 1 ? 'Grantee' : 'Grantees'}
          />
        </a>
      </SimpleGrid>
    </VStack>
  );
};
