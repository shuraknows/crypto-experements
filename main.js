const {Blockchain} = require('./modules/blockchain');
const {Transaction} = require('./modules/transaction');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// private key
const myPrivateKey = ec.keyFromPrivate('2d839ca56285504a45f5aa7c23c32b63680c29c1c642123963b222ccb3327ee0');
const myWalletAddress = myPrivateKey.getPublic('hex');


// ----------------------------------------------------
let gigabyteCoin = new Blockchain();


const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10)
tx1.signTransaction(myPrivateKey);
gigabyteCoin.addTransaction(tx1);


console.log('\n Starting the miner ...');
gigabyteCoin.minePendingTransaction(myWalletAddress);

console.log('\n Balance of my wallet', gigabyteCoin.getBalanceOfAddress(myWalletAddress));
console.log('\n Is chain is valid', gigabyteCoin.isChainValid());
