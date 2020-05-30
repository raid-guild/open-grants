# OpenGrant Smart Contracts

[![NoahMarconi](https://circleci.com/gh/NoahMarconi/grant-contracts.svg?style=shield)](https://circleci.com/gh/NoahMarconi/grant-contracts)


Reference Implementation for OpenGrant proposed EIP.

Write up and announcement here: https://medium.com/@jamesfickel/open-grants-standard-erc-6ed9e137d4fe

EIP Draft: https://github.com/JFickel/EIPs/blob/draft_grant_standard/EIPS/eip-draft_grant_standard.md

Front end project: https://github.com/NoahMarconi/grants-platform-mono

Project Sponsors: https://github.com/JFickel & https://molochdao.com/


## Build Contracts
# Set up guide

```
$ docker pull ethereum/solc:stable
$ npm i
```

Tested with node/npm versions:

```
$ node --version
> v12.16.3

$ npm --version
> 6.14.4
```

## Build Contracts

```
$ npm run build
```

## Test Contracts

Run all tests
```
$ npm run test
```

Run single test
```
$ npm run test -- test/[FILENAME]
```

Test docs:

  - https://ethereum-waffle.readthedocs.io/

