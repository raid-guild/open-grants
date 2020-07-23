import { task, usePlugin, BuidlerConfig } from "@nomiclabs/buidler/config";
require('dotenv').config();

usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-ganache");
usePlugin("solidity-coverage");

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;

const config: any = {
    solc: {
        evmVersion: "constantinople",
        version: "0.6.8"
    },
    paths: {
        artifacts: "./build"
    },
    networks: {
        coverage: {
          url: 'http://127.0.0.1:8555', // Coverage launches its own ganache-cli client
          // blockGasLimit: 0xfffffffffff,
          // gas: 0xfffffffffff,
          // gasPrice: 0x01
        },
        ropsten: {
          url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
          accounts: [`0x${ROPSTEN_PRIVATE_KEY}`]
        },
        ganache: {
          url: 'http://127.0.0.1:8555',
          defaultBalanceEther: 1000
        }
      },
};

export default config;