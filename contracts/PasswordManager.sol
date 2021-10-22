// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PasswordManager is Ownable{

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

    //TODO Inherits from at least one library or interface - Done: Inherits from Openzeppelin's Ownable

    //TODO Can be easily compiled, migrated and tested
    //TODO Have at least five unit tests for your smart contract(s) that pass. 
    //In the code, include a sentence or two explaining what the tests are covering their expected behavior.

    /* Events */
    event PasswordSaved(address indexed sender, Password pw);

    event PasswordDeleted(address indexed sender);

    event PasswordUpdated(address indexed sender);

    // address public owner;

    //contract ballance
    uint public balance;

    //Create struct for passwords
    struct Password {
        string domain;
        string username;
        string password;
    }

    //Have mapping for storing passwords
    mapping(address => Password[]) private passwords;


    // constructor() {
    //     owner = msg.sender;
    // }

    /* Modifiers - maybe? */
    modifier hasAPassword {
        require(passwords[msg.sender].length > 0, "There are no passwords to retrieve!");
        _;
    }
    
    //Removed this modifier after added OpenZeppelin
    // modifier onlyOwner {
    //     require(msg.sender == owner, "Only the owner can access this function!");
    //     _;
    // }


    function getPasswordList() public view hasAPassword returns (Password[] memory){ //not sure yet whether to use the Password struct or to break it down into its components as arguments 

        //return password list
        return passwords[msg.sender];
    }

    function saveNewPassword(string memory _domain, string memory _username, string memory _password) public payable returns (bool){

        //- Prepare passord
        Password memory encryptedPassword = Password({domain: _domain, username: _username, password: _password});

        //add to passwords mapping
        passwords[msg.sender].push(encryptedPassword);



        emit PasswordSaved(msg.sender, encryptedPassword);

        //return true
        return true;
    }

    function updatePassword(uint _index, string memory _updatedDomain, string memory _updatedUsername, string memory _updatedPassword) public hasAPassword returns (bool){ 
        //- ?Check if it exists in mapping (may be done at browser level)
        // require(passwords[msg.sender], "You do not have a password stored.");

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
        (bool success, ) = msg.sender.call{value: _amountToWithdraw}("Withdrawal from Password Manager");
        require(success);
        
        return true;
    }
    
    
}