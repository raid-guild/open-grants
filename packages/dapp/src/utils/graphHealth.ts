import { CONFIG } from 'config';
import { gql, request } from 'graphql-request';

const healthQuery = gql`
  query getHealthStatus($subgraphName: String!) {
    health: indexingStatusForCurrentVersion(subgraphName: $subgraphName) {
      synced
      health
      fatalError {
        message
      }
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`;

type FatalError = {
  message: string;
} | null;

type Chains = {
  chainHeadBlock: {
    ['number']: string;
  };
  latestBlock: {
    ['number']: string;
  };
}[];

export type GraphHealth = {
  isReachable: boolean;
  isFailed: boolean;
  isSynced: boolean;
  latestBlockNumber: number;
  chainHeadBlockNumber: number;
};

const extractStatus = ({
  fatalError,
  synced,
  chains,
}: {
  fatalError: FatalError;
  synced: boolean;
  chains: Chains;
}): GraphHealth => ({
  isReachable: true,
  isFailed: !!fatalError,
  isSynced: synced,
  latestBlockNumber: Number(chains[0].latestBlock.number),
  chainHeadBlockNumber: Number(chains[0].chainHeadBlock.number),
});

const failedStatus: GraphHealth = {
  isReachable: false,
  isFailed: true,
  isSynced: false,
  latestBlockNumber: 0,
  chainHeadBlockNumber: 0,
};

export const getHealthStatus = async (): Promise<GraphHealth> => {
  try {
    const data = await request(CONFIG.graphHealthUrl, healthQuery, {
      subgraphName: CONFIG.graphName,
    });
    return extractStatus(data.health);
  } catch (graphHealthError) {
    // eslint-disable-next-line no-console
    console.error({ graphHealthError });
  }
  return failedStatus;
};
