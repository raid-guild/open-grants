/// <reference types="react-scripts" />
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';
declare module 'react-vis';
declare module 'styled-components';
declare module 'fake-tag' {
  function gql(
    literals: TemplateStringsArray,
    ...placeholders: string[]
  ): string;
  export = gql;
}
declare module 'ipfs-http-client';
declare module 'base-58';
