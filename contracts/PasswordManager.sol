// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract PasswordManager {

    

    //TODO Comments

    //TODO Use at least two design patterns from the "Smart Contracts" section

    //TODO Protect against two attack vectors from the "Smart Contracts" section with its the SWC number

    //TODO Inherits from at least one library or interface

    //TODO Can be easily compiled, migrated and tested
    //TODO Have at least five unit tests for your smart contract(s) that pass. 
    //In the code, include a sentence or two explaining what the tests are covering their expected behavior.

    /* Events */
    event PasswordListRead(address indexed sender);

    event PasswordSaved(address indexed sender);

    event PasswordDeleted(address indexed sender);

    event PasswordUpdated(address indexed sender);

    address public owner;

    //contract ballance

    //creat struct for passwords
    struct Password {
        bytes32 domain;
        bytes32 username;
        bytes32 password;
    }

    //Have mapping for storing passwords
    mapping(address => Password[]) passwords;


    constructor() public{
        owner = msg.sender;
    }

    /* Modifiers - maybe? */
    modifier hasAPassword {
        require(passwords[msg.sender].length > 0);
        _;
    }


    function getPasswordList() public view hasAPassword returns (Password[] memory){ //not sure yet whether to use the Password struct or to break it down into its components as arguments 

        //- ?Check if it exists in mapping (may be done at browser level)
        // require(passwords[msg.sender], "You do not have a password stored.");

       
        emit PasswordListRead(msg.sender);

        //return password list
        return passwords[msg.sender];
    }

    function saveNewPassword(bytes32 _domain, bytes32 _username, bytes32 _password) public payable returns (bool){

        //- ?Check if it exists in mapping (may be done at browser level)

        //- encrypt
        Password memory encryptedPassword = Password({domain: _domain, username: _username, password: _password});

        //add to passwords mapping
        passwords[msg.sender].push(encryptedPassword);

        emit PasswordSaved(msg.sender);

        //return true
        return true;
    }

    function updatePassword() public view hasAPassword returns (Password[] memory){ //not sure yet whether to use the Password struct or to break it down into its components as arguments 

        //- ?Check if it exists in mapping (may be done at browser level)
        // require(passwords[msg.sender], "You do not have a password stored.");

       
        emit PasswordRead(msg.sender);
        
        //return password list
        return passwords[msg.sender];
    }

    function deletePassword() public view hasAPassword returns (Password[] memory){ //not sure yet whether to use the Password struct or to break it down into its components as arguments 

        //- ?Check if it exists in mapping (may be done at browser level)
        // require(passwords[msg.sender], "You do not have a password stored.");

       
        emit PasswordRead(msg.sender);
        
        //return password list
        return passwords[msg.sender];
    }

    //fallback function
    // fallback() payable public {

    // }

    //function to withdraw funds from contract - onlyOwner
}