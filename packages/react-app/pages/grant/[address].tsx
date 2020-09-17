import { VStack } from '@chakra-ui/core';
import { GrantHeader } from 'components/GrantHeader';
import { getGrant } from 'graphql/getGrant';
import { getGrantAddresses } from 'graphql/getGrantAddresses';
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import React from 'react';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const GrantPage: React.FC<Props> = ({ grant }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  if (!grant) {
    return <Error statusCode={404} />;
  }

  return (
    <VStack w="100%">
      <GrantHeader grant={grant} />
    </VStack>
  );
};

export default GrantPage;

type QueryParams = { address: string };

export const getStaticPaths: GetStaticPaths<QueryParams> = async () => {
  const grants = await getGrantAddresses();

  return {
    paths: grants.map(({ id }) => ({
      params: { address: id },
    })),
    fallback: true,
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const address = context.params?.address;
  const grant = await getGrant(address);

  return {
    props: {
      grant,
      revalidate: true,
    },
  };
};
