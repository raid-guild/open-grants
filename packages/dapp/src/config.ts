export const CONFIG =
  process.env.REACT_APP_NETWORK === 'mainnet'
    ? {
        network: { chainId: 1, name: 'ETH Mainnet' },
        graphURL:
          'https://api.thegraph.com/subgraphs/name/dan13ram/open-grants',
        infuraId: process.env.REACT_APP_INFURA_ID,
        grantFactory: '0xd91f4e34716c00d83117570ec6b3cbaf13a3fe71',
        streamFactory: '0xf65Ab2b0043c999D3889d7e789ab0808ec50E7A4',
        ipfsEndpoint: 'https://ipfs.infura.io',
        boxEndpoint: 'https://ipfs.3box.io',
        explorerEndpoint: 'https://etherscan.io',
        featuredGrants: ['0x53e7daa8e3aa23cd30c75b2f599c303bada17064'],
      }
    : {
        network: { chainId: 42, name: 'Kovan Testnet' },
        graphURL:
          'https://api.thegraph.com/subgraphs/name/dan13ram/kovan-grants-platform',
        infuraId: process.env.REACT_APP_INFURA_ID,
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
