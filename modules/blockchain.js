const {Block} = require('./block');
const {Transaction} = require('./transaction');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.diffuculty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    /**
     * @returns {Block}
     */
    createGenesisBlock() {
        return new Block("01/01/2021", [], "0");
    }

    /**
     * @returns {Block}
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * @param {string} miningRewardAddress
     */
    minePendingTransaction(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.diffuculty);
        this.chain.push(block);

        // add reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    /**
     * @param {Transaction} transaction
     */
    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must have from and to address');
        }

        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    /**
     * @param {string} address
     *
     * @returns {number}
     */
    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }

                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    /**
     * @returns {boolean}
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            return true;
        }
    }
};

module.exports.Blockchain = Blockchain;
