const express = require('express');
const router = express.Router();
const BlockchainController = require('../controller/BlockchainController');

router.get('/', BlockchainController.prototype.getBlockchain);
router.get('/wallets/create', BlockchainController.prototype.createWallet);
router.post('/wallets/access', BlockchainController.prototype.accessWallet);
router.get('/wallets/balance/:address', BlockchainController.prototype.getBalance);
router.get('/wallets/mined-blocks/:address', BlockchainController.prototype.getMinedBlocks);

router.post('/transaction/create', BlockchainController.prototype.createTransaction);
router.post('/mine-block', BlockchainController.prototype.mineBlock);

router.get('/blocks', BlockchainController.prototype.getBlockchain);
router.get('/transactions', BlockchainController.prototype.getTransactions);

module.exports = router;
