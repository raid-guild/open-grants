// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

/* local env */
const protocol = 'http';
// const host = 'grantsportal.rejoicehub.com';
const host = 'localhost';
// const port = '';
const port = '7001';
const trailUrl = 'api/v1';

const webHost = 'http://localhost:4200/';

/* Live env */
// const protocol = 'http';
// const host = 'dotnetapi.tk';
// const port = '';
// const trailUrl = 'api';

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
  TEMP_URL: hostUrl
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
