class TxIn {
  constructor(txOutId, txOutIndex, signature, from, to, amount, timestamp) {
    this.txOutId = txOutId;
    this.txOutIndex = txOutIndex;
    this.signature = signature;
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.timestamp = timestamp;
  }
}

module.exports = TxIn;