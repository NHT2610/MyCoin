const Block = require('Block');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.stakeholders = {};
    this.difficulty = 2;
  }

  createGenesisBlock() {
    const timestamp = Math.floor(Date.now() / 1000);
    return new Block(0, timestamp, [], '', '');
  }
  getLastestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previousHash = this.getLastestBlock().hash;

  }
  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('Invalid index');
      return false;
    }
    return true;
  }
}

module.exports = Blockchain;