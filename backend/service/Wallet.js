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
    const key = ec.keyFromPrivate(privateKey, 'hex');
    return key.sign(transaction.id).toDER('hex');
  }
  static getCurrentTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  }
  static createTransaction(from, to, amount, unspentTxOuts, txPool, privateKey) {
    // Kiểm tra có đủ số lượng coin để gửi
    const myUnspentTxOuts = unspentTxOuts.filter(uTxO => uTxO.address === from);
    console.log(myUnspentTxOuts);
    const myAmount = myUnspentTxOuts.reduce((acc, uTxO) => acc + uTxO.amount, 0);
    if (myAmount < amount) {
      throw new Error('Insufficient funds');
    }
    // Tính toán số coin từ các uTxO, tạo các txOuts mới và txIns
    let currentAmount = 0;
    const txIns = [];
    for (const uTxO of myUnspentTxOuts) {
      const txIn = new TxIn(uTxO.txOutId, uTxO.txOutIndex, '', from, to, amount, Wallet.getCurrentTimestamp());
      txIns.push(txIn);
      currentAmount += uTxO.amount;
      if (currentAmount >= amount) break;
    }
    const txOuts = [new TxOut(to, amount)];
    if (currentAmount > amount) {
      txOuts.push(new TxOut(from, currentAmount - amount));
    }
    // Tạo transaction từ txIns và txOuts vừa tạo, ký vào mỗi txIn và thêm transaction mới vào pool
    const transaction = new Transaction(txIns, txOuts);
    transaction.txIns.forEach(txIn => txIn.signature = Wallet.signTxIn(transaction, txIn, privateKey));
    txPool.addTransaction(transaction, unspentTxOuts);
    return transaction;
  }
  static getBalance(aUnspentTxOuts, address) {
    const unspentTxOuts = aUnspentTxOuts.filter(uTxO => uTxO.address === address);
    return unspentTxOuts.reduce((total, uTxO) => total + uTxO.amount, 0);
  }
}

module.exports = Wallet;