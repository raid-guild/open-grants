export const CONFIG = {
  network: { chainId: 42, name: 'Kovan testnet' }, // 1 = mainnet, 42 = kovan
  graphURL:
    'https://api.thegraph.com/subgraphs/name/dan13ram/kovan-grants-platform',
  infuraId:
    process.env.REACT_APP_INFURA_ID || '57ba444904fd48efb684381f59419cd9',
  grantFactory: '0x74CaB5920Ccb4C78EB6b260F40f29753394749AE',
  // streamFactory: '0x5320AC4f2d0F6dBfd8a2858DF21B92E2D026598e',
  streamFactory: '0x94Cb6B9D9dB7e6AE9b992d4410113bFc24D97f4E',
  ipfsEndpoint: 'https://ipfs.infura.io',
  boxEndpoint: 'https://ipfs.3box.io',
  explorerEndpoint: 'https://kovan.etherscan.io',
  featuredGrants: [
    '0xd27fbf23357108ddecc48bce447873e530f8e7b1',
    '0x5463268aabb59e022e85a37763415d8d01366209',
  ],
};
