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
│   ├── ISSUE_TEMPLATE
│   │   └── add-featured-grant.md
│   └── workflows
│       ├── check.yml
│       ├── deploy-kovan.yml
│       └── deploy-mainnet.yml
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
│   │   │   ├── UnmanagedGrant.sol
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
│   │   │   │   │   └── UnmanagedGrantFactory.sol
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
│   │   │   │   │       ├── ABDKMath64x64.md
│   │   │   │   │       ├── ABDKMath64x64.sol
│   │   │   │   │       ├── ABDKMathQuad.md
│   │   │   │   │       ├── ABDKMathQuad.sol
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
│   │   │       └── GrantToken._sol
│   │   ├── deployments.json
│   │   ├── package.json
│   │   ├── scripts
│   │   │   ├── grantFactory.ts
│   │   │   └── vestingFactory.ts
│   │   ├── test
│   │   │   ├── GranteeConstructor.spec.ts
│   │   │   ├── UnmanagedStream.spec.ts
│   │   │   └── shared
│   │   │       ├── BaseGrantConstructor.ts
│   │   │       ├── Funding.ts
│   │   │       ├── GranteeConstructor.ts
│   │   │       └── helpers.ts
│   │   ├── truffle-config.js
│   │   ├── tsconfig.json
│   │   └── waffle.js
│   ├── dapp
│   │   ├── @types
│   │   │   ├── base-58
│   │   │   │   └── index.d.ts
│   │   │   ├── fake-tag
│   │   │   │   └── index.d.ts
│   │   │   ├── ipfs-http-client
│   │   │   │   └── index.d.ts
│   │   │   └── react-vis
│   │   │       └── index.d.ts
│   │   ├── README.md
│   │   ├── codegen.yml
│   │   ├── package.json
│   │   ├── public
│   │   │   ├── android-chrome-192x192.png
│   │   │   ├── android-chrome-256x256.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── browserconfig.xml
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   ├── favicon.ico
│   │   │   ├── index.html
│   │   │   ├── manifest.json
│   │   │   ├── mstile-150x150.png
│   │   │   ├── robots.txt
│   │   │   └── safari-pinned-tab.svg
│   │   ├── src
│   │   │   ├── App.tsx
│   │   │   ├── Routes.tsx
│   │   │   ├── assets
│   │   │   │   ├── chest.svg
│   │   │   │   ├── discord.svg
│   │   │   │   ├── done.svg
│   │   │   │   ├── eth-crystal-wave.png
│   │   │   │   ├── eth-icon.png
│   │   │   │   ├── github.svg
│   │   │   │   ├── header.jpg
│   │   │   │   ├── loading.svg
│   │   │   │   ├── navbar.jpg
│   │   │   │   ├── success.svg
│   │   │   │   ├── tile-background.svg
│   │   │   │   ├── twitter.svg
│   │   │   │   ├── waves.svg
│   │   │   │   ├── whale.svg
│   │   │   │   └── whaleLoader__data.json
│   │   │   ├── components
│   │   │   │   ├── AmountDisplay.tsx
│   │   │   │   ├── ChartHint.tsx
│   │   │   │   ├── CreateGrantForm.tsx
│   │   │   │   ├── CreateGrantModal.tsx
│   │   │   │   ├── DistributeFunds.tsx
│   │   │   │   ├── DurationSelector.tsx
│   │   │   │   ├── ErrorAlert.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── ExploreHeader.tsx
│   │   │   │   ├── FAQContent.tsx
│   │   │   │   ├── FAQHeader.tsx
│   │   │   │   ├── FundGrantModal.tsx
│   │   │   │   ├── GrantChart.tsx
│   │   │   │   ├── GrantChartPlot.tsx
│   │   │   │   ├── GrantContent.tsx
│   │   │   │   ├── GrantDetails.tsx
│   │   │   │   ├── GrantFunder.tsx
│   │   │   │   ├── GrantFunders.tsx
│   │   │   │   ├── GrantHeader.tsx
│   │   │   │   ├── GrantRecipient.tsx
│   │   │   │   ├── GrantRecipients.tsx
│   │   │   │   ├── GrantStream.tsx
│   │   │   │   ├── GrantTextInput.tsx
│   │   │   │   ├── GrantTile.tsx
│   │   │   │   ├── GranteesInput.tsx
│   │   │   │   ├── GrantsSorter.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── InProgressStream.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Leader.tsx
│   │   │   │   ├── Leaderboard.tsx
│   │   │   │   ├── Link.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── LoadingModal.tsx
│   │   │   │   ├── LoadingPage.tsx
│   │   │   │   ├── MethodSelector.tsx
│   │   │   │   ├── NavBar.tsx
│   │   │   │   ├── ProfileContent.tsx
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   ├── ProfileImage.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── StopStreamModal.tsx
│   │   │   │   ├── StreamTile.tsx
│   │   │   │   └── SuccessModal.tsx
│   │   │   ├── config.ts
│   │   │   ├── contexts
│   │   │   │   ├── SearchContext.tsx
│   │   │   │   └── Web3Context.tsx
│   │   │   ├── graphql
│   │   │   │   ├── client.ts
│   │   │   │   ├── fragments.ts
│   │   │   │   ├── getGrant.ts
│   │   │   │   ├── getGrants.ts
│   │   │   │   ├── getLeaders.ts
│   │   │   │   ├── getProfile.ts
│   │   │   │   ├── getRank.ts
│   │   │   │   ├── search.ts
│   │   │   │   └── utils.ts
│   │   │   ├── hooks
│   │   │   │   └── useGraphHealth.ts
│   │   │   ├── icons
│   │   │   │   ├── ArrowDownIcon.tsx
│   │   │   │   ├── CloseIcon.tsx
│   │   │   │   ├── CopyIcon.tsx
│   │   │   │   ├── FeaturedIcon.tsx
│   │   │   │   ├── InNeedIcon.tsx
│   │   │   │   ├── InfoIcon.tsx
│   │   │   │   ├── LatestIcon.tsx
│   │   │   │   ├── QuestionIcon.tsx
│   │   │   │   ├── SearchIcon.tsx
│   │   │   │   └── TrendingIcon.tsx
│   │   │   ├── index.tsx
│   │   │   ├── pages
│   │   │   │   ├── create.tsx
│   │   │   │   ├── explore.tsx
│   │   │   │   ├── faq.tsx
│   │   │   │   ├── grant
│   │   │   │   │   ├── address.tsx
│   │   │   │   │   ├── funders.tsx
│   │   │   │   │   ├── recipients.tsx
│   │   │   │   │   └── streams.tsx
│   │   │   │   ├── leaderboard.tsx
│   │   │   │   └── profile
│   │   │   │       └── address.tsx
│   │   │   ├── react-app-env.d.ts
│   │   │   ├── theme.ts
│   │   │   └── utils
│   │   │       ├── 3box.ts
│   │   │       ├── chart.ts
│   │   │       ├── constants.ts
│   │   │       ├── grants.ts
│   │   │       ├── graphHealth.ts
│   │   │       ├── helpers.ts
│   │   │       ├── ipfs.ts
│   │   │       ├── streams.ts
│   │   │       └── types.ts
│   │   └── tsconfig.json
│   └── subgraph
│       ├── README.md
│       ├── abis
│       │   ├── EtherVesting.json
│       │   ├── EtherVestingFactory.json
│       │   ├── UnmanagedGrant.json
│       │   └── UnmanagedGrantFactory.json
│       ├── config
│       │   ├── kovan.json
│       │   └── mainnet.json
│       ├── package.json
│       ├── schema.graphql
│       ├── src
│       │   ├── grants.ts
│       │   ├── helpers.ts
│       │   └── stream.ts
│       └── subgraph.template.yaml
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
