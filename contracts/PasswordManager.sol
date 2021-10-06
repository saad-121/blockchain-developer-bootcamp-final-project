// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.9.0;
pragma solidity ^0.8.0;
// pragma experimental ABIEncoderV2;

contract PasswordManager {

    //fallback function
    fallback() payable external {
    balance += msg.value;
    }

    receive() payable external {
    balance += msg.value;
    }

    //TODO Comments

    //TODO Use at least two design patterns from the "Smart Contracts" section

    //TODO Protect against two attack vectors from the "Smart Contracts" section with its the SWC number

    //TODO Inherits from at least one library or interface

    //TODO Can be easily compiled, migrated and tested
    //TODO Have at least five unit tests for your smart contract(s) that pass. 
    //In the code, include a sentence or two explaining what the tests are covering their expected behavior.

    /* Events */
    event PasswordListRead(address indexed sender);

    event PasswordSaved(address indexed sender, Password pw);

    event PasswordDeleted(address indexed sender);

    event PasswordUpdated(address indexed sender);

    address public owner;

    //contract ballance
    uint public balance;

    //creat struct for passwords
    struct Password {
        // uint index;
        bytes32 domain;
        bytes32 username;
        bytes32 password;
    }

    //Have mapping for storing passwords
    mapping(address => Password[]) public passwords;


    constructor() {
        owner = msg.sender;
    }

    /* Modifiers - maybe? */
    modifier hasAPassword {
        require(passwords[msg.sender].length > 0, "There are no passwords to retrieve!");
        _;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can access this function!");
        _;
    }


    function getPasswordList() public view hasAPassword returns (Password[] memory){ //not sure yet whether to use the Password struct or to break it down into its components as arguments 

        //- ?Check if it exists in mapping (may be done at browser level)
        // require(passwords[msg.sender].length > 0, "You do not have a password stored.");

       
        // emit PasswordListRead(msg.sender);

        //return password list
        return passwords[msg.sender];
    }

    function saveNewPassword(bytes32 _domain, bytes32 _username, bytes32 _password) public payable returns (bool){

        //- ?Check if it exists in mapping (may be done at browser level)

        //Set password index. This will be used as a key by the frontend.
        // uint _index = 0;
        // if (passwords[msg.sender].length > 0) {
        //     _index = passwords[msg.sender].length;
        // }
        //- encrypt
        // Password memory encryptedPassword = Password({index: _index, domain: _domain, username: _username, password: _password});
        Password memory encryptedPassword = Password({domain: _domain, username: _username, password: _password});

        //add to passwords mapping
        passwords[msg.sender].push(encryptedPassword);

        emit PasswordSaved(msg.sender, encryptedPassword);

        //return true
        return true;
    }

    function updatePassword(uint _index, bytes32 _updatedDomain, bytes32 _updatedUsername, bytes32 _updatedPassword) public hasAPassword returns (bool){ //not sure yet whether to use the Password struct or to break it down into its components as arguments 

        //- ?Check if it exists in mapping (may be done at browser level)
        // require(passwords[msg.sender], "You do not have a password stored.");

        // passwords[msg.sender][_index] = Password({index: _index, domain: _updatedDomain, username: _updatedUsername, password: _updatedPassword});
        passwords[msg.sender][_index] = Password({domain: _updatedDomain, username: _updatedUsername, password: _updatedPassword});

        emit PasswordUpdated(msg.sender);
        
        //return true
        return true;
    }

    function deletePassword(uint _index) public hasAPassword returns (bool){ //not sure yet whether to use the Password struct or to break it down into its components as arguments 

        //- ?Check if it exists in mapping (may be done at browser level)
        // require(passwords[msg.sender], "You do not have a password stored.");
        
        uint l = passwords[msg.sender].length;
        
        if (l > 1) {
            passwords[msg.sender][_index] = passwords[msg.sender][l - 1];
        }
        
        passwords[msg.sender].pop();
       
        emit PasswordDeleted(msg.sender);
        
        //return true
        return true;
    }



    //function to withdraw funds from contract - onlyOwner
    function withdraw(uint _amountToWithdraw) public payable onlyOwner returns (bool) {
        require(_amountToWithdraw <= balance, "Insufficient balance!");
        balance -= _amountToWithdraw;
        (bool success, ) = owner.call{value: _amountToWithdraw}("Withdrawal from Password Manager");
        require(success);
        
        return true;
    }
    
    
}