# Design Patterns used

## Inheritance and Interfaces

The contract inherits OpenZeppelin's Ownable module. This provides a basic access control mechanism, where there is an account (an owner) that can be granted exclusive access to specific functions. By default, the owner account will be the one that deploys the contract. The module's modifier **onlyOwner** is used to only allow the contract owner to withdraw funds from the contract.

## Access Control Design Patterns

In addition to the **onlyOwner** modifier used above, the contract has a hasAPassword modifier that ensures that a **msg.sender** has to have a password saved before they can retrieve, update or delete passwords. Also, the *msg.sender** can only view their own passwords. 