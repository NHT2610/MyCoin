/** @member {Object} */
const CryptoJS = require('crypto-js');
const Block = require('./Block');
const TransactionPool = require('./TransactionPool');
const UnspentTxOut = require('./transaction/UnspentTxOut');
const TxOut = require('./transaction/TxOut');
const Transaction = require('./Transaction');

class Blockchain {
  constructor() {
    this.blockchain = [this.createGenesisBlock()];
    this.transactionPool = new TransactionPool([]);
    this.unspentTxOuts = [new UnspentTxOut()];
    this.stakeholders = {};
  }

  initUnspentTxOutForNewWallet(wallet) {
    const genesisTxOut = new TxOut(wallet.publicKey, 50);
    const genesisTransaction = new Transaction([], [genesisTxOut]);
    this.unspentTxOuts.push(new UnspentTxOut(genesisTransaction.id, 0, wallet.publicKey, 50));
  }
  calculateHash(index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
  }
  calculateHashForBlock(block) {
    return this.calculateHash(block.index, block.previousHash, block.timestamp, block.data);
  }
  createGenesisBlock() {
    return new Block(0, '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627', '', 1465154705, []);
  }
  getCurrentTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  }
  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  addBlock(newBlock) {
    if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
      this.blockchain.push(newBlock);
      const validator = this.selectValidator();
      if (validator) {
        this.updateStakeholders(validator, 1);
      }
      this.updateUnspentTxOuts(newBlock.data);
      return true;
    }
    return false;
  }
  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) return false;
    if (previousBlock.hash === newBlock.previousHash) return false;
    return this.calculateHashForBlock(newBlock) !== newBlock.hash;
  }
  selectValidator() {
    const stakeholders = Object.keys(this.stakeholders);
    const totalStake = stakeholders.reduce((total, address) => total + this.stakeholders[address], 0);
    let winner = null;
    let max = 0;
    stakeholders.forEach((address) => {
      const probability = this.stakeholders[address] / totalStake;
      if (Math.random() < probability && probability > max) {
        winner = address;
        max = probability;
      }
    });
    return winner;
  }
  mineBlock(wallet) {
    const validator = this.selectValidator();
    if (validator !== wallet.publicKey) {
      throw new Error('You are not the selected validator');
    }
    const validTransactions = this.transactionPool.getTransactions();
    const newBlock = this.generateNextBlock(validTransactions, wallet);
    if (this.addBlock(newBlock)) {
      this.updateUnspentTxOuts(newBlock.data);
      this.transactionPool.clear();
      return newBlock;
    }
  }
  generateNextBlock(transactions, wallet) {
    const previousBlock = this.getLatestBlock();
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = this.getCurrentTimestamp();
    const nextHash = this.calculateHash(nextIndex, previousBlock.hash, nextTimestamp, transactions);
    return new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, transactions);
  }
  updateStakeholders(address, amount) {
    if (!this.stakeholders[address]) {
      this.stakeholders[address] = 0;
    }
    this.stakeholders[address] += amount;
  }
  updateUnspentTxOuts(newTransactions) {
    const newUnspentTxOuts = newTransactions.map(tx => {
      return tx.txOuts.map((txOut, index) => new UnspentTxOut(tx.id, index, txOut.address, txOut.amount));
    }).flat();
    const consumedTxOuts = newTransactions.map(tx => tx.txIns).flat().map(txIn => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));
    this.unspentTxOuts = this.unspentTxOuts.filter(uTxO => !this.hasTxOut(uTxO, consumedTxOuts)).concat(newUnspentTxOuts);
  }
  hasTxOut(txOut, list) {
    return list.find(t => t.txOutId === txOut.txOutId && t.txOutIndex === txOut.txOutIndex);
  }
}

module.exports = Blockchain;