import WalletConnectProvider from '@walletconnect/web3-provider';
import { CONFIG } from 'config';
import { ethers } from 'ethers';
import { AsyncSendable } from 'ethers/providers';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

type Web3ContextType = {
  ethersProvider: ethers.providers.Web3Provider | null;
  connectWeb3: () => Promise<void>;
  disconnect: () => void;
  account: string;
  isSupportedNetwork: boolean;
};

export const Web3Context = createContext<Web3ContextType>({
  ethersProvider: null,
  connectWeb3: async () => {},
  disconnect: () => undefined,
  account: '',
  isSupportedNetwork: true,
});

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: CONFIG.infuraId,
    },
  },
};

export const Web3ContextProvider: React.FC = ({ children }) => {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [account, setAccount] = useState<string>('');
  useEffect(() => {
    setWeb3Modal(
      new Web3Modal({
        cacheProvider: true,
        providerOptions,
      }),
    );
  }, []);

  const [
    ethersProvider,
    setEthersProvider,
  ] = useState<ethers.providers.Web3Provider | null>(null);

  const [isSupportedNetwork, setSupportedNetwork] = useState(true);

  const setWeb3Provider = async (web3Provider: Web3, updateAccount = false) => {
    if (web3Provider) {
      const provider = new ethers.providers.Web3Provider(
        web3Provider.currentProvider as AsyncSendable,
      );

      setEthersProvider(provider);
      const network = await provider.getNetwork();
      setSupportedNetwork(network.chainId === CONFIG.network.chainId);
      if (updateAccount) {
        const signer = provider.getSigner();
        const gotAccount = await signer.getAddress();
        setAccount(gotAccount);
      }
    }
  };

  const connectWeb3 = useCallback(async () => {
    if (web3Modal) {
      const modalProvider = await web3Modal.connect();

      setWeb3Provider(new Web3(modalProvider), true);

      // Subscribe to accounts change
      modalProvider.on('accountsChanged', (accounts: Array<string>) => {
        setAccount(accounts[0]);
      });

      // Subscribe to chainId change
      modalProvider.on('chainChanged', () => {
        setWeb3Provider(new Web3(modalProvider));
      });
    }
  }, [web3Modal]);

  const disconnect = useCallback(async () => {
    web3Modal?.clearCachedProvider();
    setAccount('');
    setEthersProvider(null);
  }, [web3Modal]);

  useEffect(() => {
    if (window.ethereum) window.ethereum.autoRefreshOnNetworkChange = false;
    if (web3Modal?.cachedProvider) {
      // eslint-disable-next-line no-console
      connectWeb3().catch(console.error);
    }
  }, [web3Modal, connectWeb3]);

  return (
    <Web3Context.Provider
      value={{
        ethersProvider,
        connectWeb3,
        disconnect,
        account,
        isSupportedNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
