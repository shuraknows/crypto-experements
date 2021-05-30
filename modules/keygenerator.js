const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');


console.log('---- line -----');
console.log('public key:',  publicKey);
console.log('private key:', privateKey);


//module.exports.Block = Block;
