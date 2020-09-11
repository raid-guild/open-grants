import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { Layout } from '../components/Layout';
import { Web3ContextProvider } from '../contexts/Web3Context';
import { theme } from '../theme';

const app: React.FC<AppProps> = ({ pageProps, Component }) => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Web3ContextProvider>
        <Layout >
            <Component {...pageProps} />
        </Layout>
      </Web3ContextProvider>
    </ChakraProvider>
  );
};

export default app;
