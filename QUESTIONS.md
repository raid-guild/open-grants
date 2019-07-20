Consistent return value (funds or success/fail)?

Sweep (accidental transfers)?

GrantStatus transition conditions?

Grant Types (capped, etc.)

Same address, fund multiple times

# Status Transitions.
(implement in reference implementation but do not enforce in standard)

INIT --create--> SIGNAL --endSignaling--> FUND --?--> PAY 

{ FUND, PAY } --initRefund--> REFUND

{ SIGNAL, FUND, PAY } --?--> COMPLETE 