const express = require('express');
const router = express.Router();
const Wallet = require('../service/Wallet');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});
router.get('/create', function(req, res) {
  const wallet = new Wallet();
  const privateKey = wallet.privateKey;
  const publicKey = wallet.publicKey;
  res.send({ privateKey, publicKey });
})
router.post('/access', function(req, res) {
  const { privateKey } = req.body;
  try {
    const key = ec.keyFromPrivate(privateKey);
    const publicKey = key.getPublic('hex');
    res.send({ publicKey });
  } catch (e) {
    res.status(400).send(e.message);
  }
})

module.exports = router;
