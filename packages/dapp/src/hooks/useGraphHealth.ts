import { useToast } from '@chakra-ui/react';
import { Web3Context } from 'contexts/Web3Context';
import { useContext, useEffect, useRef, useState } from 'react';
import { getHealthStatus } from 'utils/graphHealth';

const UPDATE_INTERVAL = 60000;

const THRESHOLD_BLOCKS = 10;

export const useGraphHealth = (description: string): void => {
  const { ethersProvider } = useContext(Web3Context);

  const [healthy, setHealthy] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ethersProvider) return () => undefined;
    const subscriptions: ReturnType<typeof setTimeout>[] = [];
    const unsubscribe = () => {
      subscriptions.forEach(s => {
        clearTimeout(s);
      });
    };

    const load = async () => {
      try {
        setLoading(true);
        const [health, blockNumber] = await Promise.all([
          getHealthStatus(),
          ethersProvider.getBlockNumber(),
        ]);

        setHealthy(
          health &&
            health.isReachable &&
            !health.isFailed &&
            health.isSynced &&
            Math.abs(health.latestBlockNumber - blockNumber) <
              THRESHOLD_BLOCKS &&
            Math.abs(health.chainHeadBlockNumber - blockNumber) <
              THRESHOLD_BLOCKS,
        );

        const timeoutId = setTimeout(() => load(), UPDATE_INTERVAL);
        subscriptions.push(timeoutId);
      } catch (graphHealthError) {
        // eslint-disable-next-line no-console
        console.error({ graphHealthError });
      } finally {
        setLoading(false);
      }
    };

    // unsubscribe from previous polls
    unsubscribe();

    load();
    // unsubscribe when unmount component
    return () => unsubscribe();
  }, [ethersProvider]);

  const toast = useToast();
  const toastIdRef = useRef<string | number | undefined>();

  useEffect(() => {
    if (!loading) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      if (!healthy) {
        toastIdRef.current = toast({
          title: 'Subgraph Error',
          description,
          status: 'error',
          duration: null,
          isClosable: false,
        });
      }
    }
  }, [healthy, loading, toast, description]);
};
