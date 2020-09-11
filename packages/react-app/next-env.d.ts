/// <reference types="next" />
/// <reference types="next/types/global" />
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';
declare module 'fake-tag' {
  function gql(
    literals: TemplateStringsArray,
    ...placeholders: string[]
  ): string;
  export = gql;
}

declare module 'ipfs-http-client';
