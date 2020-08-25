# Audit Scope

[UnmanagedStream.sol](./contracts/UnmanagedStream.sol) is a simple implementation of a grant contract. It receives payment and splits (push payment) between grantees by predefined proportions.

The [UnmanagedStream.sol](./contracts/UnmanagedStream.sol) contract relies on a number of shared dependencies within the repo:

* [Percentages.sol](./shared/libraries/Percentages.sol): Shared percent of total calculations using ABDK's quadpoint library. There is no published version of ABDK's library on npm which is why we duplicate the code in our repo (i.e. "vendoring"). The quadpoint library allows us to use a shared calculation for tokens and ether, even when the token contract has an unusually large supply. We do sacrifice some precision (accurate up to 15 decimal places for ether and tokes with 18 decimal places) and will not be able to support tokens with low or no decimal places.
* [GranteeConstructor.sol](./shared/modules/GranteeConstructor.sol): Shared constructor for initializing grantees and their respective amounts.
* [IGrantee.sol](./shared/interfaces/IGrantee.sol): Interface and events defined for `Grantee` contract.
* [Grantee.sol](./shared/storage/Grantee.sol): Shared getters / setters for grantee specific private state variables. NOTE: not all are initialized or used in the [UnmanagedStream.sol](./contracts/UnmanagedStream.sol) contract.
* [IFunding.sol](./shared/interfaces/IFunding.sol): Interface and events defined for `Funding` contract.
* [Funding.sol](./shared/storage/Funding.sol): Shared getters / setters for `totalFunding` private state variable.
* [IBaseGrant.sol](./shared/interfaces/IBaseGrant.sol): Interface and events defined for `BaseGrant` contract.
* [BaseGrant.sol](./shared/storage/BaseGrant.sol): Shared getters / setters for common grant private state variables. Most grant implementations will extend the `BaseGrant`.

The repo includes a WIP directory which is out of scope for the current audit.

Commit hash `940cd7c8243a94048205213185983d9cfdcae5c0` on the `master` branch is the current code base to audit.

Tests are located in the [./test](./test/) directory.