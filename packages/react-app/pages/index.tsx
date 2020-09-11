import { SimpleGrid, VStack } from '@chakra-ui/core';
import { getGrants } from 'graphql/getGrants';
import { InferGetStaticPropsType } from 'next';
import React from 'react';

import { HomeHeader } from 'components/HomeHeader';
import { GrantTile } from 'components/GrantTile';
import { parseGrants } from 'utils/grants'; 

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = async () => {
    const grants = await getGrants();
    const parsedGrants = await parseGrants(grants);
    return {
        props: {
            grants: parsedGrants,
            revalidate: true
        },
    };
};

const Home: React.FC<Props> = ({ grants }) => (
    <VStack w="100%">
        <HomeHeader />
        <SimpleGrid columns={[1, null, 2, 3]} spacing="8">
            {grants.map(grant => (
                <GrantTile key={grant.id} grant={grant} />
            ))}
        </SimpleGrid>
    </VStack>
);

export default Home;
