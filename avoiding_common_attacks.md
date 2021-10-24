# Avoiding common attacks

## SWC-107 - Re-entrancy

To avoid Reentrancy, 
### internal state changes are performed before call is executed. 
In the **withdraw** function, the contract balances aer updated before the withdrawal of Eth is made.
### Use a reentrancy lock
The **busy** boolean along with the **cannotBeBusy** modifier are used to ensure that when the contract is working on critical functions (saving, updating, and deleting passwords, as well as withdrawing Eth), only one function will run at a time and. This prevents, e.g. saving multiple passwords at the same time or deleting multiple passwords at the same time.

## SWC-102 - Outdated Compiler Version

**pragma solidity 0.8.0;** is used in the main contract, which is quite recent.


## SWC-123 - Requirement Violation

The **require()** construct is used to validate external inputs of a function. In this contract it is used is mofifiers for initial checks before the function is run, as well as at the beginning of the wothdraw function to check that there is sufficient Eth balance.