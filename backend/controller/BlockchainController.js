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
    const address = req.params.address;
    res.send({ balance: Wallet.getBalance(chain.unspentTxOuts, address) });
  }
  async createTransaction(req, res) {
    const { from, to, amount, privateKey } = req.body;
    const publicKey = Wallet.getPublicKey(privateKey);
    if (from !== publicKey) res.status(403).send('Forbidden');
    try {
      const transaction = Wallet.createTransaction(from, to, amount, chain.unspentTxOuts, chain.transactionPool, privateKey);
      res.send(transaction);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
  async mineBlock(req, res) {
    const { privateKey } = req.body;
    const publicKey = Wallet.getPublicKey(privateKey);
    const wallet = { privateKey, publicKey };
    try {
      const newBlock = chain.mineBlock(wallet);
      if (newBlock) {
        res.send(newBlock);
      } else {
        res.status(400).send('Failed to mine block');
      }
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
  async getMinedBlocks(req, res) {
    const address = req.params.address;
    res.send(chain.getMinedBlocksForWallet(address));
  }
  async getTransactions(req, res) {
    const data = chain.getTransactions().map((tx) => {
      return {
        id: tx.id,
        from: tx.txIns[0].from,
        to: tx.txIns[0].to,
        amount: tx.txIns[0].amount,
        timestamp: tx.txIns[0].timestamp
      };
    });
    res.send(data);
  }
}

module.exports = BlockchainController;