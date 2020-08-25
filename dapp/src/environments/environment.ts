// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const subgraphQuery = 'https://api.thegraph.com/subgraphs/name/dipaksavaliya/grant-platform';
const subgraphSubscription = 'wss://api.thegraph.com/subgraphs/name/dipaksavaliya/grant-platform';

export const environment = {
  production: false,
  SUBGRAPH_QUERY: subgraphQuery,
  SUBGRAPH_SUBSCRIPTION: subgraphSubscription,
  currencies: [{ name: 'Ether', value: 'ETH' }],
  ethersConfig: {
    network: 'ropsten',
    gasLimit: 6e6,
    apiToken: '6KK5NG3BDH1QEVDE2WIMQA7AD3J691QHBV',
    factoryContract: '0x6cec1dc945ac2ddf852993403d0aab39f03b3bad',
    rpcURL: 'https://ropsten.infura.io/v3/bbed5c0ec4d2452d915dc36d26ac67bf'
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
