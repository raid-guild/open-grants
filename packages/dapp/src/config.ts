export const CONFIG = {
  network: { chainId: 42, name: 'Kovan testnet' }, // 1 = mainnet, 42 = kovan
  graphURL:
    'https://api.thegraph.com/subgraphs/name/dan13ram/kovan-grants-platform',
  infuraId:
    process.env.REACT_APP_INFURA_ID || '57ba444904fd48efb684381f59419cd9',
  grantFactory: '0x74CaB5920Ccb4C78EB6b260F40f29753394749AE',
  streamFactory: '0x5320AC4f2d0F6dBfd8a2858DF21B92E2D026598e',
  ipfsEndpoint: 'https://ipfs.infura.io',
  boxEndpoint: 'https://ipfs.3box.io',
  explorerEndpoint: 'https://kovan.etherscan.io',
  featuredGrants: [],
};
