# open-grants mono repo

Together we empower developers to build the next generation of ethereum.
Come fund public goods on ethereum using open grants.

## Project Structure

This project is a monorepo created with [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

[comment]: # 'git ls-tree -r --name-only HEAD | tree --fromfile'

```
open-grants
├── .firebaserc
├── .github
│   └── workflows
│       ├── check.yml
│       └── deploy.yml
├── .gitignore
├── .prettierrc.json
├── README.md
├── firebase.json
├── package.json
├── packages
│   ├── contracts
│   │   ├── AUDIT_SCOPE.md
│   │   ├── LICENSE
│   │   ├── QUESTIONS.md
│   │   ├── README.md
│   │   ├── _archive_test
│   │   │   ├── ManagedCapped
│   │   │   │   ├── Grant-Cancel.spec.ts
│   │   │   │   ├── Grant-Factory.spec.ts
│   │   │   │   ├── Grant-Funding.spec.ts
│   │   │   │   ├── Grant-Payout.spec.ts
│   │   │   │   ├── Grant-Refunds-MultipleDonors.spec.ts
│   │   │   │   ├── Grant-Refunds.spec.ts
│   │   │   │   └── Grant.spec.ts
│   │   │   └── helpers
│   │   │       └── helpers.ts
│   │   ├── buidler-env.d.ts
│   │   ├── buidler.config.ts
│   │   ├── circle_waffle.js
│   │   ├── contracts
│   │   │   ├── D24nGrant._sol
│   │   │   ├── EtherVesting.sol
│   │   │   ├── ManagedCappedGrant._sol
│   │   │   ├── UnmanagedStream.sol
│   │   │   ├── shared
│   │   │   │   ├── WIP
│   │   │   │   │   ├── CancelableRefundable._sol
│   │   │   │   │   ├── FundGrant._sol
│   │   │   │   │   ├── GranteeAllocation._sol
│   │   │   │   │   ├── ManagedAllocation._sol
│   │   │   │   │   ├── ManagedPayout._sol
│   │   │   │   │   ├── ManagedRefund._sol
│   │   │   │   │   ├── PullPaymentGrant._sol
│   │   │   │   │   ├── Refundable._sol
│   │   │   │   │   └── Signal._sol
│   │   │   │   ├── factory
│   │   │   │   │   ├── EtherVestingFactory.sol
│   │   │   │   │   ├── IFactory.sol
│   │   │   │   │   ├── MasterFactory.sol
│   │   │   │   │   └── UnmanagedStreamFactory.sol
│   │   │   │   ├── interfaces
│   │   │   │   │   ├── IBaseGrant.sol
│   │   │   │   │   ├── IDonorFund.sol
│   │   │   │   │   ├── IDonorRefund.sol
│   │   │   │   │   ├── IFunding.sol
│   │   │   │   │   ├── IGrantee.sol
│   │   │   │   │   ├── IGranteeAllocation.sol
│   │   │   │   │   ├── IManager.sol
│   │   │   │   │   ├── ISignal.sol
│   │   │   │   │   └── ITrustedToken.sol
│   │   │   │   ├── libraries
│   │   │   │   │   ├── Percentages.sol
│   │   │   │   │   └── abdk-libraries
│   │   │   │   │       ├── ABDKMathQuad.md
│   │   │   │   │       ├── ABDKMathQuad.sol
│   │   │   │   │       ├── GrantNotes.md
│   │   │   │   │       ├── LICENSE.md
│   │   │   │   │       └── README.md
│   │   │   │   ├── modules
│   │   │   │   │   └── GranteeConstructor.sol
│   │   │   │   └── storage
│   │   │   │       ├── AbstractDonorFund.sol
│   │   │   │       ├── AbstractManager.sol
│   │   │   │       ├── BaseGrant.sol
│   │   │   │       ├── Funding.sol
│   │   │   │       └── Grantee.sol
│   │   │   └── test
│   │   │       └── GrantToken.sol
│   │   ├── package.json
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   ├── test
│   │   │   ├── GranteeConstructor.spec.ts
│   │   │   ├── UnmanagedStream.spec.ts
│   │   │   └── shared
│   │   │       ├── BaseGrantConstructor.ts
│   │   │       ├── Funding.ts
│   │   │       ├── GranteeConstructor.ts
│   │   │       └── helpers.ts
│   │   ├── tsconfig.json
│   │   └── waffle.js
│   ├── dapp
│   │   ├── README.md
│   │   ├── codegen.yml
│   │   ├── package.json
│   │   ├── public
│   │   │   ├── index.html
│   │   │   ├── manifest.json
│   │   │   └── robots.txt
│   │   ├── src
│   │   │   ├── App.tsx
│   │   │   ├── Routes.tsx
│   │   │   ├── assets
│   │   │   │   ├── eth-crystal-wave.png
│   │   │   │   ├── header.jpg
│   │   │   │   └── navbar.jpg
│   │   │   ├── components
│   │   │   │   ├── CreateGrantForm.tsx
│   │   │   │   ├── DurationSelector.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── ExploreHeader.tsx
│   │   │   │   ├── FAQContent.tsx
│   │   │   │   ├── FAQHeader.tsx
│   │   │   │   ├── FundGrantModal.tsx
│   │   │   │   ├── GrantHeader.tsx
│   │   │   │   ├── GrantTextInput.tsx
│   │   │   │   ├── GrantTile.tsx
│   │   │   │   ├── GranteesInput.tsx
│   │   │   │   ├── GrantsSorter.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Link.tsx
│   │   │   │   ├── MethodSelector.tsx
│   │   │   │   ├── NavBar.tsx
│   │   │   │   └── ProfileImage.tsx
│   │   │   ├── config.ts
│   │   │   ├── contexts
│   │   │   │   └── Web3Context.tsx
│   │   │   ├── graphql
│   │   │   │   ├── client.ts
│   │   │   │   ├── fragments.ts
│   │   │   │   ├── getGrant.ts
│   │   │   │   └── getGrants.ts
│   │   │   ├── icons
│   │   │   │   ├── ArrowDownIcon.jsx
│   │   │   │   ├── CloseIcon.jsx
│   │   │   │   ├── FeaturedIcon.jsx
│   │   │   │   ├── InNeedIcon.jsx
│   │   │   │   ├── LatestIcon.jsx
│   │   │   │   ├── QuestionIcon.jsx
│   │   │   │   ├── SearchIcon.jsx
│   │   │   │   └── TrendingIcon.jsx
│   │   │   ├── index.tsx
│   │   │   ├── pages
│   │   │   │   ├── create.tsx
│   │   │   │   ├── explore.tsx
│   │   │   │   ├── faq.tsx
│   │   │   │   └── grant
│   │   │   │       └── details.tsx
│   │   │   ├── react-app-env.d.ts
│   │   │   ├── theme.ts
│   │   │   └── utils
│   │   │       ├── 3box.ts
│   │   │       ├── grants.ts
│   │   │       ├── helpers.ts
│   │   │       ├── ipfs.ts
│   │   │       └── streams.ts
│   │   └── tsconfig.json
│   └── subgraph
│       ├── README.md
│       ├── abis
│       │   ├── EtherVesting.json
│       │   ├── EtherVestingFactory.json
│       │   ├── UnmanagedStream.json
│       │   └── UnmanagedStreamFactory.json
│       ├── package.json
│       ├── schema.graphql
│       ├── src
│       │   ├── grants.ts
│       │   ├── helpers.ts
│       │   └── stream.ts
│       └── subgraph.yaml
├── tsconfig.base.json
├── tsconfig.json
└── yarn.lock
```

Owing to this dependency on Yarn Workspaces, open-grants can't be used with npm.

## Available Scripts

In the project directory, you can run:

### React App

#### `yarn dapp:start`

Runs the React app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

#### `yarn dapp:test`

Runs the React test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

#### `yarn dapp:build`

Builds the React app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### Subgraph

#### `yarn subgraph:auth`

```sh
GRAPH_ACCESS_TOKEN=your-access-token-here yarn subgraph:auth
```

#### `yarn subgraph:codegen`

Generates AssemblyScript types for smart contract ABIs and the subgraph schema.

#### `yarn subgraph:build`

Compiles the subgraph to WebAssembly.

#### `yarn subgraph:deploy-<network>`

Deploys the subgraph for particular network to the official Graph Node.<br/>

### Contracts

#### `yarn contracts:build`

Compiles the smart contracts for deployment.

#### `yarn contracts:deploy-<network>`

Deploys the smart contracts for particular network.<br/>
