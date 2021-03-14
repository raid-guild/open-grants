import { CONFIG } from 'config';
import { createClient } from 'urql';

export const client = createClient({
  url: `https://api.thegraph.com/subgraphs/name/${CONFIG.graphName}`,
});
