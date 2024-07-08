/** @member {Object} */
const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
  constructor(txIns, txOuts) {
    this.txIns = txIns;
    this.txOuts = txOuts;
    this.id = this.getTransactionId();
  }

  getTransactionId() {
    const txInContent = this.txIns.map((txIn) => txIn.txOutId + txIn.txOutIndex).reduce((a, b) => a + b, '');
    const txOutContent = this.txOuts.map((txOut) => txOut.address + txOut.amount).reduce((a, b) => a + b, '');
    return CryptoJS.SHA256(txInContent + txOutContent).toString();
  }
  isValidTransactionStructure() {
    if (typeof this.id !== 'string') {
      console.log('transactionId missing');
      return false;
    }
    if (!(this.txIns instanceof Array)) {
      console.log('invalid txIns type in transaction');
      return false;
    }
    if (!this.txIns.map((txIn) => txIn.isValidTxInStructure()).reduce((a, b) => a && b, true)) {
      return false;
    }
    if (!(this.txOuts instanceof Array)) {
      console.log('invalid txIns type in transaction');
      return false;
    }
    return this.txOuts.map((txOut) => txOut.isValidTxOutStructure()).reduce((a, b) => a && b, true);
  }
  validateTxIn(txIn, transaction, aUnspentTxOuts) {
    const referencedUTxOut = aUnspentTxOuts.find((uTxO) => uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex);
    if (referencedUTxOut == null) {
      console.log(`referenced txOut not found: ${JSON.stringify(txIn)}`);
      return false;
    }
    const address = referencedUTxOut.address;
    const key = ec.keyFromPublic(address, 'hex');
    const validSignature = key.verify(transaction.id, txIn.signature);
    if (!validSignature) {
      console.log('invalid txIn signature: %s txId: %s address: %s', txIn.signature, transaction.id, referencedUTxOut.address);
      return false;
    }
    return true;
  }
  validateTxAmount(aUnspentTxOuts) {
    const txInsAmount = this.txIns
      .map((txIn) => {
        return aUnspentTxOuts.find((uTxO) => {
          return uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex;
        }).amount;
      })
      .reduce((a, b) => a + b, 0);
    const txOutsAmount = this.txOuts.map((txOut) => txOut.amount).reduce((a, b) => a + b, 0);
    return txInsAmount === txOutsAmount;
  }
  validateTransaction(aUnspentTxOuts) {
    // Kiểm tra cấu trúc của transaction và các thành phần bên trong
    if (!this.isValidTransactionStructure()) return false;
    console.log('passed checking structure: ', this.id);
    // Kiểm tra xem id của transaction
    if (this.getTransactionId() !== this.id) {
      console.log(`invalid tx id: ${this.id}`);
      return false;
    }
    console.log('passed checking id: ', this.id);
    // Kiểm tra chữ ký (signature) của các txIn
    const hasValidTxIns = this.txIns.map((txIn) => this.validateTxIn(txIn, this, aUnspentTxOuts)).reduce((a, b) => a && b, true);
    if (!hasValidTxIns) {
      console.log(`some of the txIns are invalid in tx: ${this.id}`);
      return false;
    }
    console.log('passed checking signature: ', this.id);
    // Kiểm tra amount trong transaction
    if (!this.validateTxAmount(aUnspentTxOuts)) {
      console.log(`totalTxOutValues !== totalTxInValues in tx: ${this.id}`);
      return false;
    }
    return true;
  }
}

module.exports = Transaction;