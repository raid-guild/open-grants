import { Container, Text } from '@chakra-ui/core';
import { getGrant } from 'graphql/getGrant';
import { getGrants } from 'graphql/getGrants';
import {
    GetStaticPaths,
    GetStaticPropsContext,
    InferGetStaticPropsType,
} from 'next';
import Error from 'next/error';
import React from 'react';
import { parseGrant } from 'utils/grants'; 

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const GrantPage: React.FC<Props> = ({ grant }) => {
    if (!grant) {
        return <Error statusCode={404} />;
    }

    const { grantAddress } = grant;

    return (
        <>
            <Container maxW="xl">
                <Text fontFamily="body">{grantAddress}</Text>
            </Container>
        </>
    );
};

export default GrantPage;

type QueryParams = { address: string };

export const getStaticPaths: GetStaticPaths<QueryParams> = async () => {
    const grants = await getGrants();

    return {
        paths: grants.map(({ grantAddress }) => ({
            params: { address: grantAddress },
        })),
        fallback: true,
    };
};

export const getStaticProps = async (
    context: GetStaticPropsContext<QueryParams>,
) => {
    const address = context.params?.address;
    const grant = await getGrant(address);
    const parsedGrant = await parseGrant(grant);

    return {
        props: {
            grant: parsedGrant,
            revalidate: true
        },
    };
};
