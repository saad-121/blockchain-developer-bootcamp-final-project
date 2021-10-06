
const contractAddress = '0xb2593FDff5416Eadd00944C52614d99941C48632';
const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "PasswordDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "PasswordListRead",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "domain",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "username",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "password",
            "type": "bytes32"
          }
        ],
        "indexed": false,
        "internalType": "struct PasswordManager.Password",
        "name": "pw",
        "type": "tuple"
      }
    ],
    "name": "PasswordSaved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "PasswordUpdated",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback",
    "payable": true
  },
  {
    "inputs": [],
    "name": "balance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "passwords",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "domain",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "username",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "password",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "stateMutability": "payable",
    "type": "receive",
    "payable": true
  },
  {
    "inputs": [],
    "name": "getPasswordList",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "domain",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "username",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "password",
            "type": "bytes32"
          }
        ],
        "internalType": "struct PasswordManager.Password[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_domain",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_username",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_password",
        "type": "bytes32"
      }
    ],
    "name": "saveNewPassword",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_updatedDomain",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_updatedUsername",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_updatedPassword",
        "type": "bytes32"
      }
    ],
    "name": "updatePassword",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "deletePassword",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amountToWithdraw",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  }
];

