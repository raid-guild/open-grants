// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true
};

/* Live env */
// http://grantsportal.rejoicehub.com/api/v1/

const protocol = 'http';
const host = 'www.opengrants.com';
const port = '';
const trailUrl = 'api/v1';
const webHost = 'http://grantsportal.rejoicehub.com/';

const subgraphQuerie = "https://api.thegraph.com/subgraphs/name/dipaksavaliya/grant-platform";
const subgraphSubscription = "wss://api.thegraph.com/subgraphs/name/dipaksavaliya/grant-platform";

const hostUrl = `${protocol}://${host}${port ? ':' + port : ''}`;
const endpoint = `${hostUrl}${trailUrl ? '/' + trailUrl : ''}`;

export const ENVIRONMENT = {
  production: false,
  API: {
    protocol,
    host,
    port,
    trailUrl,
    hostUrl,
    webHost
  },
  API_ENDPOINT: endpoint,
  TEMP_URL: hostUrl,
  SUBGRAPH_QUERIE: subgraphQuerie,
  SUBGRAPH_SUBSCRIPTION: subgraphSubscription
};

export interface APIOptions {
  protocol: string;
  host: string;
  port: string;
  trailUrl: string;
  hostUrl: string;
  webHost: string;
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.