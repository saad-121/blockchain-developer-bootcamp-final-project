// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A password manager
/// @author SHHS
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
contract PasswordManager is Ownable{

    //fallback function
    /// @notice Receive Eth
    /// @dev Receive Eth if data is empty
    fallback() payable external {
    balance += msg.value;
    }

    //receive function 
    /// @notice Receive Eth
    /// @dev Receive Eth if data is not empty
    receive() payable external {
    balance += msg.value;
    }

    //TODO Comments - Done: Added Natspec Format comments.

    //TODO Use at least two design patterns from the "Smart Contracts" section

    //TODO Protect against two attack vectors from the "Smart Contracts" section with its the SWC number

    //TODO Inherits from at least one library or interface - Done: Inherits from Openzeppelin's Ownable

    //TODO Can be easily compiled, migrated and tested
    //TODO Have at least five unit tests for your smart contract(s) that pass. 
    //In the code, include a sentence or two explaining what the tests are covering their expected behavior.

    /* Events */
    /// @notice Event emitted when a password is saved
    /// @param sender The address of the msg.sender who saved the password
    /// @param pw The password that was saved
    event PasswordSaved(address indexed sender, Password pw);

    /// @notice Event emitted when a password is deleted
    /// @param sender The address of the msg.sender who deleted the password
    event PasswordDeleted(address indexed sender);

    /// @notice Event emitted when a password is updated
    /// @param sender The address of the msg.sender who updated the password
    event PasswordUpdated(address indexed sender);

    // address public owner;

    //contract ballance
    /// @notice The balance of Eth in the contract
    /// @return The balance of Eth in the contract (when the automatic getter function is called)
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

    /// @notice Retrieve array of passwords (Password structs) saved for address that called the function (msg.sender)
    /// @dev The msg.sender address must have a Password struct saved in the passwords mapping. Otherwise, the hasAPassword modifier throws an error.
    /// @return Array of Password structs saved for address that called the function (msg.sender)
    function getPasswordList() public view hasAPassword returns (Password[] memory){ //not sure yet whether to use the Password struct or to break it down into its components as arguments 

        //return password list
        return passwords[msg.sender];
    }

    /// @notice Save new password to array of Password structs saved for address that called the function (msg.sender)
    /// @dev Function is payable
    /// @param _domain The domain of the Password struct to be saved
    /// @param _username The username of the Password struct to be saved
    /// @param _password The password of the Password struct to be saved
    /// @return True once the save operation is complete
    function saveNewPassword(string memory _domain, string memory _username, string memory _password) public payable returns (bool){

        //- Prepare passord
        Password memory encryptedPassword = Password({domain: _domain, username: _username, password: _password});

        //add to passwords mapping
        passwords[msg.sender].push(encryptedPassword);

        emit PasswordSaved(msg.sender, encryptedPassword);

        //return true
        return true;
    }

    /// @notice Update password already saved in array of Password structs
    /// @dev The msg.sender address must have a Password struct saved in the passwords mapping. Otherwise, the hasAPassword modifier throws an error.
    /// @param _index The index of the Password struct to be updated
    /// @param _updatedDomain The domain of the Password struct to be updated
    /// @param _updatedUsername The username of the Password struct to be updated
    /// @param _updatedPassword The password of the Password struct to be updated
    /// @return True once the update operation is complete
    function updatePassword(uint _index, string memory _updatedDomain, string memory _updatedUsername, string memory _updatedPassword) public hasAPassword returns (bool){ 
        //- ?Check if it exists in mapping (may be done at browser level)
        // require(passwords[msg.sender], "You do not have a password stored.");

        passwords[msg.sender][_index] = Password({domain: _updatedDomain, username: _updatedUsername, password: _updatedPassword});

        emit PasswordUpdated(msg.sender);
        
        //return true
        return true;
    }

    /// @notice Delete password already saved in array of Password structs
    /// @dev The msg.sender address must have a Password struct saved in the passwords mapping. Otherwise, the hasAPassword modifier throws an error.
    /// @param _index The index of the Password struct to be deleted
    /// @return True once the delete operation is complete
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
    /// @notice Withdraw Eth from contract
    /// @dev Only the owner of the contract can withdraw
    /// @dev Amount to withdraw cannot be more than balance in the contract
    /// @param _amountToWithdraw Amount of Eth (Wei) to be withdrawn from the contract
    /// @return True if the withdraw is successful
    function withdraw(uint _amountToWithdraw) public payable onlyOwner returns (bool) {
        require(_amountToWithdraw <= balance, "Insufficient balance!");
        balance -= _amountToWithdraw;
        (bool success, ) = msg.sender.call{value: _amountToWithdraw}("Withdrawal from Password Manager");
        require(success);
        
        return true;
    }
    
    
}