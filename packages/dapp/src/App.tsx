import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { Layout } from 'components/Layout';
import { Web3ContextProvider } from 'contexts/Web3Context';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from 'Routes';
import { theme } from 'theme';

export const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <ErrorBoundary>
        <Web3ContextProvider>
          <Router>
            <Layout>
              <Routes />
            </Layout>
          </Router>
        </Web3ContextProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};
