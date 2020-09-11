Questions:

- [x] All or nothing refunds. (prevents collusion with manager)
- [ ] ~~consider pay by increments (manager approve): total available for grants (< target funding )~~

- ~~PAY as group or pay individuals ~~

- discuss: donors can't be individually refunded but grantees can be individually paid

  - authorize payment as simple amount OR authorize individual grantee addresses.
  - authorizePayment(value, address[], amounts[]) interface, can it handle both? or alter
  - [x] withdrawPayment / withdrawRefund
  - think about: DESIGN all or nothings (like donors) for granteee payments?

- [x] switch to approve/withdraw instead of overlaoding
- [x] confirm fund function does not exceed gas limit for fallback. and test from contracts NOTE: exceeds send/transfer stipend but problem when gas specified from EOA or call
- [x] refund amount instead of person. (authorizeRefund(amount) donor calls getRefund)
- [x] ask why return balance? can we return a boolean (if payment that could fail)? or nothing?
- [x] all or nothing means all donors not all of donated funds
- [x] add canFund function

- [x] can we combine / reduce grant state
- [x] maybe use a getter for total funded (diff for ERC20 vs ETH)
- [ ] ~~can we reduce # of roles (grantor / grantee)~~
- [x] can we combine grants structs
- [x] can we get rid of grant types?
- [x] can we reduce the # of grant status?
- [x] do we want to store grant recipients as array or mapping
  - [x] do we need to iterate over this in the contract logic (A: no)
  - depends on grant payout model (pull no, push yes)
- [x] can we remove "request payment"
  - [x] are we assuming that grant managers have robust offchain comm with grantees
  - [x] what if everyone is a grant manager?
  - [x] DAO as manager (delegate management but maintain cancel control for example)
- [x] can we remove Payments[] by having a "requesting" global state
  - [x] grant managers approve / vote on the requested funds
  - [] ~~possibly use timestamp to avoid explicit states~~
  - [ ] ~~if expires then can propose again~~
  - [ ] ~~One payment at a time or not?~~
- [x] can we remove multiple grant managers / voting / m-of-n and replace w/ msig?
- [x] use donor / grantee / manager

Design Question:

- [x] (A: not preferred) Currently, the grant manager is bound by the initial allocation %s, they can
      not re-allocate the funds to grantees. So if there are two grantees each
      50/50 and one sucks, the manager will be forced to refund 50% of the money,
      they can't give it to the other not sucky grantee.
  - [x] Should we allow the manager to re-allocate?
  - [x] OR should we just do this as separate contracts with a single address?
  - [x] We do want to be able to batch grants so they don't have to hit separate
        thresholds
- [ ] ~~Maybe design a "Manager" interface that implements whitelists of grantees,
      whether or not we can re-allocate funds between grantees, etc...~~

Refunds:

- [x] Three refund operations:
  - [x] 1. The grant does not reach the funding goal in time.
    - [x] any donor can withdraw
    - [ ] bonus for auto-withdraw
  - [x] 2. The grant managers decides to refund the donors.
  - [x] 3. The grant reaches the funding goal, but funds are still remaining after a second expiration date
  - [x] kill expiration on the grant contract which freezes all future payouts
  - [ ] ~~[no longer a problem] auto triggered refunding halts previously approved but never claimed payouts. Fix by tracking pending payouts.~~

Stretch Goal:

- [ ] ~~can we outsource grantees~~
- [x] can we outsource grant manager to a separate contract?
  - [ ] ~~if we have one that makes sense as a sane default~~
  - [ ] ~~what are all the interfaces between grantees / managers / grants?~~

TODO:

- [x] Validate targeted funding sums to grantee allocations.
- [x] MAYBE partial refunds by tracking donations
- [x] auto refund if expiration and target not reached
  - [x] open to anybody can trigger
- [x] use counter for ID
- [x] signal should be a function (yes or no)
- [x] uniqueness check on grantees
  - [x] also switch % to amount and check matches total

Notes:

- [x] spawn new contract for each grant
- [x] send ETH directly to grant

Spec Recommendations:

- [x] use clock not blocks

Bonus:

- [x] prevent duplicate addresses
      https://github.com/christianlundkvist/simple-multisig/blob/720386bc141b8f5e5d4dc57519e4e6c3e43b4911/contracts/SimpleMultiSig.sol#L27

~~FUND_THRESHOLD, // Funds unlocked if threshold met.~~

- ~~time based expiration~~
  ~~FUNDER_VOTE, // Funds unlocked if funders approve.~~
- ~~funders become grant managers~~
- ~~get votes based on donations~~
  ~~MANAGED, // Funds unlocked by grant_managers.~~
- ~~pre-selected grant managers~~
  ~~OPAQUE // Other offchain method.~~
- ~~?~~

- [x] Reject eth if currency is token.
- [x] Fallback function for simple eth transfer
- [x] Return the rest if over funded.
- [x] Fixed sized grants you pre-populate on create

  - [ ] ~~If dynamic sized grant you calculate.~~

- [x] Consistent return value (funds or success/fail)?
- [ ] ~~Sweep (accidental transfers)?~~
- [x] Grantee cannot be GrantManager.
