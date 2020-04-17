# grants-platform

Front End to the Open Grants Standard. 

Write up and announcement here: https://medium.com/@jamesfickel/open-grants-standard-erc-6ed9e137d4fe

EIP Draft: https://github.com/JFickel/EIPs/blob/draft_grant_standard/EIPS/eip-draft_grant_standard.md

Contracts: https://github.com/NoahMarconi/grant-contracts

Project Sponsors: https://github.com/JFickel & https://molochdao.com/


# Project 

Consists of `server` and `client` packages. 

```
root
  +-- client
  +-- server
```

# client

Angular / Ionic based front end

```
client root
  +-- design
  +-- e2e
  +-- src
    +-- @types
    +-- app
      +-- common
      +-- config
      +-- guard
      +-- pages
      +-- services
    +-- assets
    +-- environments
    +-- theme
```

## app/pages

Client side routes `client/src/app/pages/pages-routing.module.ts`.

### my-grants

Index view for all user grants. User would be one of a Donor, Grantee, or Manager. Grants arranged in columns based on role.

![my grants](docs/mygrants.png)


### grant-details

Shows current state of grant. Based on role, more or less interaction options exist (e.g. cancel grant, approveRefund, fund, etc.).

![grant details](docs/grantdetail.png)



### create-new-grant

Configure and launch a new grant contract.

Grant description is stored in back end db.

![create grant](docs/create.png)



### latest-grants

Unfiltered list of recent grants. 

![latest grants](docs/latest.png)


### auth

Sign in / Register workflow temporary. Will migrate to 3box.io

![auth](docs/auth.png)


## app/services

  - Smart contract calls are managed by `client/src/app/services/ethcontract.service.ts` and currently assume a Metamask web3 provider is available on the page.
  - Auth services are currently handled by `client/src/app/services/authentication.service.ts`. Near-term todo is to defer to 3box.io for authentication.
  - Remaining services manage pending notifying backend of pending Smart Contract transactions and handling off chain data.





# server

Server intended to provide access to offchain data, such as grant descriptions, track pending transactions, and provide history cache.


## user

`server/src/server/user/user.module.ts`

User registry. Plan to largely replace with 3box.io

## grant

`server/src/server/grant/grant.module.ts`

Records grants launched through the Open Grants front end. Replicates basic data stored on-chain as well as additional context such as the grant details (written summary / pitch for grant).


## signal

To be developed. Will track on chain `signalling` using [carbon-vote-like interface](https://github.com/NoahMarconi/grant-contracts/blob/master/contracts/ISignal.sol) and events from the reference implementation. Serves as the basis for trending grants list.

## helpers

`server/src/helpers/schedule.service.ts`

CRON job to check status of pending transactions


# TODO

  - [ ] Do not ask user for address. Capture from Metamask or 3box.io integration
  - [ ] Determine network from webprovider
  - [ ] ETH/WEI and TOKEN/Atomic Uint conversion
  - [ ] Grantees and Manager should be address strings OR ens records
  - [ ] ENS integration
  - [ ] Permit views for non registered users (any 3box auth lets user in)
  - [ ] move env to .env
  - [ ] reset secrets
  - [ ] config external mongo service
  - [ ] npm audit
  - [ ] SSL
  - [ ] Editor license
  - [ ] DAI support
  - [ ] Arbitrary token support
  - [ ] The Graph https://thegraph.com/ for queries
  - [ ] UI refactor for each ROLE’s { NULL, Manager, Grantee, Donor } grant view
  - [ ] Determine whether link to grant description stored in grant contract or defer to ENS
  - [ ] Use factor contract to deploy new grants. Confirm factor has required events for tracking.




# Dev Setup

```{sh}
git clone git@github.com:NoahMarconi/grants-platform-mono.git

cd grants-platform-mono

# from project root
cd client && npm i
npm run start

# from project root
cd server && npm i
npm run start
```


# Docker images with Multi Stage Builds

```{sh}
# Build the image
docker-compose --build

# Build the image && up
docker-compose up --build

# Docker up
docker-compose up

# Docker down
docker-compose down
```
Dockerized app will be accessible at http://localhost:4200