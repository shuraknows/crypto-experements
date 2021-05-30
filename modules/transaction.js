const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    /**
     * @param {string} fromAddress
     * @param {string} toAddress
     * @param {number} amount
     */
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = null;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    /**
     * @param {KeyPair} signingPrivateKey
     */
    signTransaction(signingPrivateKey) {
        if (signingPrivateKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets');
        }

        const transactionHash = this.calculateHash();
        const signature = signingPrivateKey.sign(transactionHash, 'base64');
        this.signature = signature.toDER('hex');
    }

    /**
     * @returns {boolean}
     */
    isValid() {
        if (this.fromAddress === null) {
            return true;
        }

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');

        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

module.exports.Transaction = Transaction;
