const Wallet = require('../service/Wallet');
const Blockchain = require('../service/Blockchain');
const chain = new Blockchain();

class BlockchainController {
  async getBlockchain(req, res) {
    res.send(chain.blockchain);
  }
  async createWallet(req, res) {
    const wallet = new Wallet();
    chain.initUnspentTxOutForNewWallet(wallet);
    const privateKey = wallet.privateKey;
    const publicKey = wallet.publicKey;
    res.send({ privateKey, publicKey });
  }
  async accessWallet(req, res) {
    const { privateKey } = req.body;
    try {
      const publicKey = Wallet.getPublicKey(privateKey);
      res.send({ publicKey });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
  async getBalance(req, res) {
    const { publicKey } = req.body;
    res.send({ balance: Wallet.getBalance(chain.unspentTxOuts, publicKey) });
  }
}

module.exports = BlockchainController;