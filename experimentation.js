const EthCrypto = require('eth-crypto');

// create identitiy with key-pairs and address
const alice = EthCrypto.createIdentity();
console.log(alice);

const secretMessage = "My name is Satoshi Buterin";
const encrypted = EthCrypto.encryptWithPublicKey(
    alice.publicKey, // encrypt with alice's publicKey
    secretMessage
);

const decrypted = EthCrypto.decryptWithPrivateKey(
    alice.privateKey,
    encrypted
);

if(decrypted[0] === secretMessage) console.log('success');