# OpenGrant Smart Contracts

[![NoahMarconi](https://circleci.com/gh/NoahMarconi/grant-contracts.svg?style=shield)](https://circleci.com/gh/NoahMarconi/grant-contracts)
[![codecov](https://codecov.io/gh/NoahMarconi/grant-contracts/branch/master/graph/badge.svg)](https://codecov.io/gh/NoahMarconi/grant-contracts)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Dependency Check](https://img.shields.io/david/noahmarconi/grant-contracts)](https://david-dm.org/NoahMarconi/grant-contracts)
[![Dependency Check](https://img.shields.io/david/dev/noahmarconi/grant-contracts)](https://david-dm.org/NoahMarconi/grant-contracts?type=dev)


Reference Implementation for OpenGrant proposed EIP.

Write up and announcement here: https://medium.com/@jamesfickel/open-grants-standard-erc-6ed9e137d4fe

EIP Draft: https://github.com/JFickel/EIPs/blob/draft_grant_standard/EIPS/eip-draft_grant_standard.md

Front end project: https://github.com/NoahMarconi/grants-platform-mono

Project Sponsors: https://github.com/JFickel & https://molochdao.com/


# Table of Contents

- [Variations](#Variations)
- [Directory Structure](#Directory-Structure)
  * [contracts](#contracts)
    + [shared contract directory](#shared-contract-directory)
  * [test](#test)
  * [scripts](#scripts)
- [Set-up Guide](#Set-up-Guide)
- [TODO](#TODO)


# Variations

Grants come with many variations. 

  - Managed or Unmanaged
  - Token or Ether
  - With Funding Deadline or Without
  - With Funding Target or Without
  - Fixed Grantee Allocations or Proportion Based Grantee Allocations
  - With Contract Expiration or Without
  - Capped or Uncapped
  - and likely more

Reference permutations include:

  - [UnmanagedStream.sol](./contracts/UnmanagedStream.sol) an unmanaged grant with proportion based grantee allocations. Funds are immediately pushed to grantee and not dust is left in the grant. (rounding up or down always impacts final grantee)


# Directory Structure

Three main directories include:

```
root
  +-- contracts
  +-- tests
  +-- scripts
```

## contracts

All `solidity` files are found in the [contracts](./contracts/) directory. 

```
contracts root
  +-- shared
  +-- test
```

Contracts appearing in the [contracts](./contracts/) root directory are intended to be deployed and used.

Contracts appearing in the [test](./contracts/test) directory are used for testing purposes only.


### shared contract directory

```
contract/shared root
  +-- interfaces
  +-- libraries
  +-- storage
  +-- WIP
```

  * [interfaces](./contracts/shared/interfaces/) contains contract interfaces.
  * [libraries](./contracts/shared/libraries/) contains shared libraries.
  * [storage](./contracts/shared/storage/) is where contract state is managed. Each grant variant requires different state and variants requiring less state may simply avoid inheriting from storage contracts they do not need. All storage `getters` are `external` and all `setters` are `internal`.
  * [modules](./contracts/shared/modules/) contains shared modules which tie one or more storage contracts together.
  * [WIP](./contracts/shared/WIP/) contains work in progress contracts.


The primary means of composing and creating new grant types is by combining `storage` contracts together to create `module` contracts. Due to inheritance linearization it may not be possible to inherit from multiple `module` contract; `storage` contracts are, however, isolated and more than one may be inherited from.  


## test


```
test root
  +-- shared
```

All test specs are found in the root [test](./test/)  directory.

The [shared](./test/shared/) directory contains general [helpers](./test/shared/helpers.ts) and tests intended to be reused multiple times. For example, testing that the constructor properly initialized the `BaseGrant` state should be take place for every grant variant; these tests are found in [BaseGrantConstructor.ts](./test/shared/BaseGrantConstructor.ts). 


## scripts

Contains project level helper scripts such as the [deploy-factory](scripts/deploy-factory.ts) helper. 


# Set-up Guide

```
docker pull ethereum/solc:stable
npm install
```

Tested with node/npm versions:

```
node --version
# > v12.16.3

npm --version
# > 6.14.4
```

## Lint Contracts

```
npm run lint
```

## Build Contracts

```
npm run build
```

## Test Contracts

Run all tests
```
npm run test
```

Check code coverage
```
npm run coverage
```


## Deploy

First set up the `.env` file by renaming .example-env: `cp .example-env .env` and filling in the private key and infura project ID.

```
npm run factory:deploy:ropsten
```



# TODO

* BaseGrant tests
  * totalPaid
  * grantCancelled
  * setters

* Grantee tests
  * Pull payment