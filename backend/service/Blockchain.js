/** @member {Object} */
const CryptoJS = require('crypto-js');
const Block = require('./Block');
const TransactionPool = require('./TransactionPool');
const UnspentTxOut = require('./transaction/UnspentTxOut');
const TxOut = require('./transaction/TxOut');
const Transaction = require('./Transaction');
const TxIn = require('./transaction/TxIn');
const Wallet = require('./Wallet');

class Blockchain {
  constructor() {
    this.blockchain = [this.createGenesisBlock()];
    this.transactions = [];
    this.transactionPool = new TransactionPool([]);
    this.unspentTxOuts = [new UnspentTxOut()];
    this.stakeholders = {};
    this.initWalletCoins = 50;
    this.coinBase = 1;
  }

  addTransactions(aTransactions) {
    this.transactions = this.transactions.concat(aTransactions);
    console.log(this.transactions);
    return this.transactions;
  }
  initUnspentTxOutForNewWallet(wallet) {
    const txOutIndex = this.getLatestBlock().index + 1;
    const genesisTxIn = new TxIn('', txOutIndex, '', wallet.publicKey, '', 0, this.getCurrentTimestamp());
    const genesisTxOut = new TxOut(wallet.publicKey, this.initWalletCoins);
    const genesisTransaction = new Transaction([genesisTxIn], [genesisTxOut]);
    this.unspentTxOuts.push(new UnspentTxOut(genesisTransaction.id, 0, wallet.publicKey, 50));
    const newBlock = this.generateNextBlock([genesisTransaction], wallet, this.initWalletCoins);
    this.blockchain.push(newBlock);
    this.stakeholders[wallet.publicKey] = this.initWalletCoins;
  }
  calculateHash(index, previousHash, timestamp, data, validator, nCoins) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data + validator + nCoins).toString();
  }
  calculateHashForBlock(block) {
    return this.calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.validator, block.nCoins);
  }
  createGenesisBlock() {
    return new Block(0, '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627', '', 1465154705, [], '', 0);
  }
  getCurrentTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  }
  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  getMinedBlocksForWallet(address) {
    return this.blockchain.filter(block => block.validator === address);
  }
  getTransactions() {
    console.log(this.transactions);
    return this.transactions;
  }
  addBlock(newBlock) {
    if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
      this.blockchain.push(newBlock);
      this.updateUnspentTxOuts(newBlock.data);
      const validator = this.selectValidator();
      if (validator) {
        const validatorBalance = Wallet.getBalance(this.unspentTxOuts, validator);
        this.updateStakeholders(validator, validatorBalance);
      }
      return true;
    }
    return false;
  }
  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) return false;
    if (previousBlock.hash !== newBlock.previousHash) return false;
    return this.calculateHashForBlock(newBlock) === newBlock.hash;
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
    if (winner === null && stakeholders.length > 0) {
      winner = stakeholders[stakeholders.length - 1];
    }
    return winner;
  }
  createCoinbaseTransaction(address, blockIndex) {
    const txIn = new TxIn('', blockIndex, '', '', address, 0, this.getCurrentTimestamp());
    const txOut = new TxOut(address, this.coinBase);
    return new Transaction([txIn], [txOut]);
  }
  mineBlock(wallet) {
    const validator = this.selectValidator();
    console.log(validator);
    if (validator !== wallet.publicKey) {
      throw new Error('You are not the selected validator');
    }
    const coinbaseTx = this.createCoinbaseTransaction(validator, this.getLatestBlock().index + 1);
    const validTransactions = this.transactionPool.getTransactions();
    const data = [coinbaseTx].concat(validTransactions);
    const newBlock = this.generateNextBlock(data, wallet, this.coinBase);
    if (this.addBlock(newBlock)) {
      this.transactionPool.clear();
      return newBlock;
    }
  }
  generateNextBlock(transactions, wallet, nCoins) {
    this.addTransactions(transactions);
    const previousBlock = this.getLatestBlock();
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = this.getCurrentTimestamp();
    const validator = wallet.publicKey;
    const nextHash = this.calculateHash(nextIndex, previousBlock.hash, nextTimestamp, transactions, validator, nCoins);
    return new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, transactions, validator, nCoins);
  }
  updateStakeholders(address, amount) {
    if (!this.stakeholders[address]) {
      this.stakeholders[address] = 0;
    }
    this.stakeholders[address] = amount;
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