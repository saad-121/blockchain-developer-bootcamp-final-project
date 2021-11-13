# Password Manager

## Project Description

This is a password manager that encrypts the user's passwords with their crypto address' public key and decrypts them using the private key. Encryptions would be stored on the blockchain. 

The user adds the domain/web site, the username and the password. The domain is stored on the blockchain unencrypted, while the username and password are encrypted before they are stored in the blockchain.

When the user wants to retrieve the password, they connect their wallet to the frontend site and their saved passwords are retrieved. Initially, the user can see the domains of the different passwords. If the user wishes to see the username and password related to a particular domain, they can click the `SHOW PASSWORD` button and these fields will be decrypted and revealed to them.

The user can modify(update) and/or delete stored password(s). The user can also add new passwords

This solution provides permanent decentralized storage of sensitive data (user's passwords). Being decentralized, this data is a lot less likely to be controlled by one or few entities and is easily accessible from virtually anywhere. Even though the data is easily accessible, encrypting it with the user's public key means that thitey cannot be "read" or used by anyone but the user. The encryption they go through is the same encryption that ensures the security of the blockchain.

## Installing dependencies
You need to have node and npm installed. This package was created on node v16.10.0 and npm 7.24.0.

First, clone this repo: On terminal, you can run `git clone https://github.com/shhs121/blockchain-developer-bootcamp-final-project`

Then to install dependencies, run `npm install` or `npm run bootstrap` in the project directory.
## Directory structure
- The contracts folder contains the main contract file `PasswordManager.sol` in addition to Migrations.sol.
- The migrations folder contains files needed for migration of the contracts.
- public and src folders contain files needed for frontend deployment. The app.js file is in src folder.
- In addition, src/build folder is where truffle migration files are stored. These include the ABI's.
- The test folder contains the PasswordManager.test.js file, the main file for truffle testing of the contract.
- design_pattern_decisions.md and avoiding_common_attacks.md describe design patterns and security measures.
- deployed_address.txt contains the testnet address and network where the contract has been deployed.
- The .env.example file provides fields which should be populated by your own Infura account details, MetaMask mnemonics, any private keys. (see section below on .env population)
  
## Where the frontend project can be accessed
https://icy-fire-8128.on.fleek.co
## Walk-through
A screencast of walking through the project can be accessed here: https://www.loom.com/share/3dd5cdf3274c4a5ead6e150d3f6ebe8f
## How to populate the .env locally with your own information
Fill out the keys and addresses in the ".env.example" file and rename the file to ".env"
## Migrating your contract
Before you migrate the contract, you need to populate the .env file as described above.
You alse need to have truffle installed. 
If you have Ganache installed, you can install dependencies, compile the contract, and migrate to Ganache.
To do that, run `npm run deploy` on terminal. Note: local testnet should be running on port: 7545.
If you want to migrate to Ropsten testnet, run `npm run deployropsten`

(Please check the section below on installing truffle and Ganache is you do not have them.)
## Smart Contract Unit Tests
Go to the root directory of this project and run `npm run test` on the terminal.
Note: For smart contract unit tests, local testnet should be running on port: 7545.

## Installing truffle and Ganache
To install truffle, you can run `npm install -g truffle`.
Ganache can be downloaded from https://www.trufflesuite.com/ganache or you can install ganache-cli by running `npm install ganache-cli@latest --global`.

## Public Ethereum account

