class Block {
  constructor(index, hash, previousHash, timestamp, data, validator, nCoins) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.validator = validator;
    this.nCoins = nCoins;
  }
}

module.exports = Block;