import { Heading, SimpleGrid, VStack } from '@chakra-ui/core';
import { PageContainer } from 'components/Container';
import { MetaLink } from 'components/Link';
import { getGrants } from 'graphql/getGrants';
import { InferGetStaticPropsType } from 'next';
import React from 'react';

import BackgroundImage from '../public/images/login-background.jpg';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
    const grants = await getGrants();
    return {
        props: {
            grants,
        },
    };
};

const Home: React.FC<Props> = ({ grants }) => (
    <PageContainer backgroundImage={`url(${BackgroundImage})`}>
        <SimpleGrid columns={[1, null, 2, 3]} spacing="8">
            {grants.map(grant => (
                <VStack
                    key={grant.id}
                    bg="whiteAlpha.200"
                    style={{ backdropFilter: 'blur(7px)' }}
                    rounded="lg"
                    py="6"
                    px="4"
                    spacing="6"
                >
                    <MetaLink
                        as={`/grant/${grant.grantAddress}`}
                        href="grant/[username]"
                        key={grant.id}
                    >
                        <VStack>
                            <Heading size="xs">{grant.grantAddress}</Heading>
                        </VStack>
                    </MetaLink>
                </VStack>
            ))}
        </SimpleGrid>
    </PageContainer>
);

export default Home;
