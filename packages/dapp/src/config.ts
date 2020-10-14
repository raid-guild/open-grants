export const CONFIG = {
  network: 'kovan',
  graphURL:
    'https://api.thegraph.com/subgraphs/name/dan13ram/kovan-grants-platform',
  infuraId:
    process.env.REACT_APP_INFURA_ID || '57ba444904fd48efb684381f59419cd9',
  grantFactory: '0x7A6f602667f22D2Ec33636148e441A7c2D124380',
  streamFactory: '0xC5baEAc62cA32537693C4bb364713231c413d871',
  ipfsEndpoint: 'https://ipfs.infura.io',
  boxEndpoint: 'https://ipfs.3box.io',
  explorerEndpoint: 'https://kovan.etherscan.io',
  featuredGrants: [
    '0x2862c2c26581a106665c4f4733e0b2bcccdaf38d',
    '0xa9a17e4afc0bfafbac076ddcb5b224b0a7194660',
    '0xd610a73468218b8bc3f833179206a128c7a233ae',
  ],
};
