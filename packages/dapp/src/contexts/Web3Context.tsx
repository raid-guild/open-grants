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
  loading: boolean;
  isSupportedNetwork: boolean;
};

export const Web3Context = createContext<Web3ContextType>({
  ethersProvider: null,
  connectWeb3: async () => {},
  disconnect: () => undefined,
  account: '',
  loading: false,
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

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});

export const Web3ContextProvider: React.FC = ({ children }) => {
  const [account, setAccount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

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
    setLoading(true);
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
    setLoading(false);
  }, []);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setAccount('');
    setEthersProvider(null);
  }, []);

  useEffect(() => {
    if (window.ethereum) window.ethereum.autoRefreshOnNetworkChange = false;
    if (web3Modal.cachedProvider) {
      // eslint-disable-next-line no-console
      connectWeb3().catch(console.error);
    } else {
      setLoading(false);
    }
  }, [connectWeb3]);

  return (
    <Web3Context.Provider
      value={{
        ethersProvider,
        connectWeb3,
        disconnect,
        account,
        loading,
        isSupportedNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
