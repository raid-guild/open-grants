import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import { PageHeader } from 'components/PageHeader';
import { AppProps } from 'next/app';
import Head from 'next/head';

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
        {!pageProps.hidePageHeader && <PageHeader />}
        <Component {...pageProps} />
      </Web3ContextProvider>
    </ChakraProvider>
  );
};

export default app;
