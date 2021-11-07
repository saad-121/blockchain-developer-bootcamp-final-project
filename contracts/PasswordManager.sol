// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A password manager
/// @author SHHS
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
/// @dev Inherits OpenZeppelin's Ownable module
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

    //TODO Use at least two design patterns from the "Smart Contracts" section - Done: Added to design_pattern_decisions.md

    //TODO Protect against two attack vectors from the "Smart Contracts" section with its the SWC number - Done: Added to avoiding_common_attacks.md

    //TODO Inherits from at least one library or interface - Done: Inherits from Openzeppelin's Ownable

    //TODO Can be easily compiled, migrated and tested
    //TODO Have at least five unit tests for your smart contract(s) that pass. - Done: Have six tests that pass.
    //In the code, include a sentence or two explaining what the tests are covering their expected behavior. - Done: added comments to the tests.

    /* Events */
    /// @notice Event emitted when a password is saved
    /// @param savedBy The address of the msg.sender who saved the password
    event PasswordSaved(address indexed savedBy);

    /// @notice Event emitted when a password is deleted
    /// @param deletedBy The address of the msg.sender who deleted the password
    event PasswordDeleted(address indexed deletedBy);

    /// @notice Event emitted when a password is updated
    /// @param updatedBy The address of the msg.sender who updated the password
    event PasswordUpdated(address indexed updatedBy);

    // address public owner;

    //contract ballance
    /// @notice The balance of Eth in the contract
    /// @return The balance of Eth in the contract (when the automatic getter function is called)
    uint public balance;

    /// @notice Indicator of whether some functions did not complete
    /// @dev Used to prevent re-entrancy attacks
    bool public busy = false;


    //Mpping for storing passwords
    mapping(address => Password[]) private passwords;


    //Struct for storing passwords
    //Contains a string with unencrypted Domain
    //Contains a string with encrypted username and password
    struct Password{
        string unencryptedPart;
        string encryptedPart;
    }


    /* Modifiers*/
    modifier hasAPassword {
        require(passwords[msg.sender].length > 0, "There are no passwords to retrieve!");
        _;
    }

    /// @notice Check whether some functions did not complete
    /// @dev Used to prevent re-entrancy attacks    
    modifier cannotBeBusy {
        require(!busy, "The previous request is still being processed!");
        busy = true;
        _;
        busy = false;
    }

    /// @notice Retrieve array of passwords saved for address that called the function (msg.sender)
    /// @dev The msg.sender address must have password(s) saved in the passwords mapping. Otherwise, the hasAPassword modifier throws an error.
    /// @return Array of passwords saved for address that called the function (msg.sender)
    function getPasswordList() public view hasAPassword returns (Password[] memory){

        //return password list
        return passwords[msg.sender];
    }

    /// @notice Save new password to array of passwords saved for address that called the function (msg.sender)
    /// @dev Function is payable
    /// @dev cannotBeBusy modifier checks whether some functions did not complete; used to prevent re-entrancy attacks
    /// @param _unencryptedPart The new unencrypted part of the password to be saved
    /// @param _encryptedPart The new encrypted part of the password to be saved
    /// @return True once the save operation is complete
    function saveNewPassword(string memory _unencryptedPart, string memory _encryptedPart) public payable cannotBeBusy returns (bool){

        //Assemble the password parts into the Password struct
        Password memory _newPassword = Password(_unencryptedPart, _encryptedPart);

        //add to passwords mapping
        passwords[msg.sender].push(_newPassword);

        emit PasswordSaved(msg.sender);

        //return true
        return true;
    }

    /// @notice Update password already saved in array of Password structs
    /// @dev The msg.sender address must have passwords saved in the passwords mapping. Otherwise, the hasAPassword modifier throws an error.
    /// @dev cannotBeBusy modifier checks whether some functions did not complete; used to prevent re-entrancy attacks
    /// @param _index The index of the password to be updated
    /// @param _unencryptedPart The unencrypted part of the password to be updated
    /// @param _encryptedPart The encrypted part of the password to be updated
    /// @return True once the update operation is complete
    function updatePassword(uint _index, string memory _unencryptedPart, string memory _encryptedPart) public hasAPassword cannotBeBusy returns (bool){ 

        //Assemble the password parts into the Password struct
        Password memory _updatedPassword = Password(_unencryptedPart, _encryptedPart);
        
        //update password
        passwords[msg.sender][_index] = _updatedPassword;

        emit PasswordUpdated(msg.sender);
        
        //return true
        return true;
    }

    /// @notice Delete password already saved in array of passwords
    /// @dev The msg.sender address must have passwords saved in the passwords mapping. Otherwise, the hasAPassword modifier throws an error.
    /// @dev cannotBeBusy modifier checks whether some functions did not complete; used to prevent re-entrancy attacks
    /// @param _index The index of the Password struct to be deleted
    /// @return True once the delete operation is complete
    function deletePassword(uint _index) public hasAPassword cannotBeBusy returns (bool){ //not sure yet whether to use the Password struct or to break it down into its components as arguments 

        
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
    /// @dev cannotBeBusy modifier checks whether some functions did not complete; used to prevent re-entrancy attacks
    /// @dev Amount to withdraw cannot be more than balance in the contract
    /// @param _amountToWithdraw Amount of Eth (Wei) to be withdrawn from the contract
    /// @return True if the withdraw is successful
    function withdraw(uint _amountToWithdraw) public payable onlyOwner cannotBeBusy returns (bool) {
        require(_amountToWithdraw <= balance, "Insufficient balance!");
        balance -= _amountToWithdraw;
        (bool success, ) = msg.sender.call{value: _amountToWithdraw}("Withdrawal from Password Manager");
        require(success);
        
        return true;
    }
    
    
}