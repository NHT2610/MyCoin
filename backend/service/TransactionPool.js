class TransactionPool {
  constructor(transactions) {
    this.transactionPool = transactions;
  }

  addTransaction(transaction, aUnspentTxOuts) {
    if (!transaction.validateTransaction(aUnspentTxOuts)) {
      throw new Error('Invalid transaction');
    }
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