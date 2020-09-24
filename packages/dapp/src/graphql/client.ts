import { CONFIG } from 'config';
import { createClient } from 'urql';

export const client = createClient({
  url: CONFIG.graphURL,
});
