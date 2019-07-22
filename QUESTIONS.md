Consistent return value (funds or success/fail)?

Sweep (accidental transfers)?

Grant Types (capped, etc.)

Same address, fund multiple times (currently yes)

Who can cancel?

Weight out of (uint8 255 or easy to calc 100)?

Allocation as percent?

GrantManager threshold constraints (any m of n, validate on create, etc)?

Delete payment request.

TODO: Grantee cannot be GrantManager.

# Status Transitions.
GrantStatus transition conditions?
(implement in reference implementation but do not enforce in standard)

INIT --create--> SIGNAL --endSignaling--> FUND --?--> PAY 

{ FUND, PAY } --initRefund--> REFUND

{ SIGNAL, FUND, PAY } --?--> COMPLETE 



fund (defer to GrantType)
cancel