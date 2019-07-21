Consistent return value (funds or success/fail)?

Sweep (accidental transfers)?

Grant Types (capped, etc.)

Same address, fund multiple times (currently yes)

Who can cancel?

# Status Transitions.
GrantStatus transition conditions?
(implement in reference implementation but do not enforce in standard)

INIT --create--> SIGNAL --endSignaling--> FUND --?--> PAY 

{ FUND, PAY } --initRefund--> REFUND

{ SIGNAL, FUND, PAY } --?--> COMPLETE 



fund (defer to GrantType)