const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficultly) {
        while (this.hash.substring(0, difficultly) !== Array(difficultly + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }

    hasValidTransactions() {
        for (const transaction of this.transactions) {
            if (!transaction.isValid()) {
                return false;
            }
        }

        return true;
    }
}

module.exports.Block = Block;
