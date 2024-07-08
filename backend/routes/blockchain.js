const express = require('express');
const router = express.Router();
const BlockchainController = require('../controller/BlockchainController');

/* GET users listing. */
router.get('/', BlockchainController.prototype.getBlockchain);
router.get('/wallets/create', BlockchainController.prototype.createWallet);
router.post('/wallets/access', BlockchainController.prototype.accessWallet);
router.get('/wallets/balance', BlockchainController.prototype.getBalance);

module.exports = router;
