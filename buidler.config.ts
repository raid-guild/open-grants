import { task, usePlugin, BuidlerConfig } from "@nomiclabs/buidler/config";

usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-ganache");
usePlugin("solidity-coverage");

const config: BuidlerConfig = {
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
        }
      }
};

export default config;