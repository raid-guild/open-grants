import {
  Flex,
  Grid,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { Link } from 'components/Link';
import React, { useEffect, useState } from 'react';
import { getProfile } from 'utils/3box';
import { getDisplayAddress, getDisplayName } from 'utils/helpers';
import { BoxProfile } from 'utils/types';

type RecipientProps = {
  account: string;
  amount: number;
  total: number;
  description: string;
};

export const GrantRecipient: React.FC<RecipientProps> = ({
  account,
  amount,
  total,
  description,
}) => {
  const percent = ((amount * 100) / total).toFixed(2);
  const [profile, setProfile] = useState<BoxProfile | undefined>();
  useEffect(() => {
    if (account) {
      getProfile(account).then(p => setProfile(p));
    }
  }, [account]);

  const displayName = getDisplayName(profile, account, description);
  return (
    <Flex direction="column" w="100%" borderBottom="1px solid #EAECEF">
      <Grid
        w="100%"
        gap={4}
        templateColumns="5fr 1fr"
        color="dark"
        minH="3rem"
        padding=".5rem 0 .5rem 0"
      >
        <Link to={`/profile/${account}`}>
          <Popover trigger="hover" placement="top-start">
            <PopoverTrigger>
              <HStack spacing={4}>
                <Flex
                  borderRadius="50%"
                  border="1px solid #E6E6E6"
                  w="2.5rem"
                  h="2.5rem"
                  overflow="hidden"
                  background="white"
                  bgImage={profile && `url(${profile.imageUrl})`}
                  bgSize="cover"
                  bgRepeat="no-repeat"
                  bgPosition="center center"
                />
                <Text fontFamily="Roboto Mono, monospace">{displayName}</Text>
              </HStack>
            </PopoverTrigger>
            <PopoverContent
              boxShadow="0px 4px 4px rgba(114, 125, 129, 0.25)"
              border="none"
              background="#D7FFEF"
              transform="translate(50%, 0)"
              p={2}
            >
              <Flex
                w="100%"
                h="100%"
                justify="center"
                align="stretch"
                fontFamily="body"
                direction="column"
              >
                <Text fontWeight="bold" fontFamily="Roboto Mono, monospace">
                  {getDisplayAddress(account, 28)}
                </Text>
                {profile?.name && <Text>{profile.name}</Text>}
                {description && <Text>{description}</Text>}
              </Flex>
            </PopoverContent>
          </Popover>
        </Link>
        <HStack>
          <Text textAlign="center" w="100%" fontFamily="Roboto Mono, monospace">
            {`${percent}%`}
          </Text>
        </HStack>
      </Grid>
    </Flex>
  );
};
