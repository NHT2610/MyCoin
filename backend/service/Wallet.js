const TxIn = require('./transaction/TxIn');
const TxOut = require('./transaction/TxOut');
const Transaction = require('./Transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Wallet {
  constructor() {
    this.keyPair = ec.genKeyPair();
    this.privateKey = this.keyPair.getPrivate('hex');
    this.publicKey = this.keyPair.getPublic('hex');
  }

  static getPublicKey(privateKey) {
    const key = ec.keyFromPrivate(privateKey);
    return key.getPublic('hex');
  }
  static getPrivateKey(publicKey) {
    const key = ec.keyFromPublic(publicKey);
    return key.getPublic('hex');
  }
  static signTxIn(transaction, txIn, privateKey) {
    const key = ec.keyFromPrivate(privateKey);
    const signature = key.sign(transaction.id);
    txIn.signature = signature.toDER('hex');
  }
  static createTransaction(from, to, amount, unspentTxOuts, txPool) {
    const txIns = [];
    const txOuts = [];

    let currentAmount = 0;
    for (const uTxO of unspentTxOuts) {
      if (uTxO.address === from && currentAmount < amount) {
        txIns.push(new TxIn(uTxO.txOutId, uTxO.txOutIndex, null, from, to, amount, new Date().getTime()));
        currentAmount += uTxO.amount;
      }
    }

    if (currentAmount < amount) {
      throw new Error('Not enough balance');
    }

    txOuts.push(new TxOut(to, amount));
    if (currentAmount > amount) {
      txOuts.push(new TxOut(from, currentAmount - amount));
    }

    const newTransaction = new Transaction(txIns, txOuts);
    txPool.addTransaction(newTransaction);
    return newTransaction;
  }
  static getBalance(aUnspentTxOuts, address) {
    const unspentTxOuts = aUnspentTxOuts.filter(uTxO => uTxO.address === address);
    return unspentTxOuts.reduce((total, uTxO) => total + uTxO.amount, 0);
  }
}

module.exports = Wallet;