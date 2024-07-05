const CryptoJS = require('crypto-js');

class Block {
  constructor(index, timestamp, transactions, previousHash, validator) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.validator = validator;
    this.nonce = 0;
    this.hash = this.caculateHash();
  }

  caculateHash() {
    return CryptoJS.SHA256(
      this.index +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.previousHash +
      this.validator +
      this.nonce)
      .toString();
  }
}

module.exports = Block;