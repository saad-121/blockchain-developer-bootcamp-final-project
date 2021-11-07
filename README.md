# Password Manager

## Project Description

This is a password manager that encrypts the user's passwords with their crypto address' public key and decrypts them using the private key. Encryptions would be stored on the blockchain. 

The user adds the domain/web site and the password. These are encrypted and stored in the blockchain.

When the user wants to retrieve the password, they connect their wallet to the frontend site and their password is decrypted and revealed to them.

The user can modify and/or delete stored password(s).

This solution provides permanent decentralized storage of sensitive data (user's passwords). Being decentralized, this data is a lot less likely to be controlled by one or few entities and is easily accessible from virtually anywhere. Even though it is easily accessible, encrypting it with the user's public key means that they cannot be "read" or used by anyone but the user. The encryption they go through is the same encryption that ensures the security of the blockchain.

## Installing dependencies
npm install
## Directory structure

## Where the frontend project can be accessed

## How to populate the .env locally with your own information. 
Fill out the keys and addresses in the ".env.example" file and rename the file to ".env"
## Smart Contract Unit Tests
Go to the root directory of this project and run 'truffle test' on the terminal.
Note: For smart contract unit tests, local testnet should be running on port: 7545.
