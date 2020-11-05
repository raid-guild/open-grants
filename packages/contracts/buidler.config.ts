import { usePlugin } from '@nomiclabs/buidler/config';
require('dotenv').config();

usePlugin('@nomiclabs/buidler-waffle');
usePlugin('@nomiclabs/buidler-ganache');
usePlugin('solidity-coverage');

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const KOVAN_PRIVATE_KEY = process.env.KOVAN_PRIVATE_KEY;

const config: any = {
  solc: {
    version: '0.7.0',
  },
  paths: {
    artifacts: './build',
  },
  networks: {
    coverage: {
      url: 'http://127.0.0.1:8555', // Coverage launches its own ganache-cli client
      // blockGasLimit: 0xfffffffffff,
      // gas: 0xfffffffffff,
      // gasPrice: 0x01
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${KOVAN_PRIVATE_KEY}`],
    },
    ganache: {
      url: 'http://127.0.0.1:8555',
      defaultBalanceEther: 1000,
    },
  },
};

export default config;
