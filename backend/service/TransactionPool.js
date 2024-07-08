const _ = require('lodash');

class TransactionPool {
  constructor(transactions) {
    this.transactionPool = transactions;
  }

  addTransaction(transaction) {
    this.transactionPool.push(transaction);
  }
  getTransactions() {
    return this.transactionPool;
  }
  clear() {
    this.transactionPool = [];
  }
}

module.exports = TransactionPool;