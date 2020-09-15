const fs = require('fs');
const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');
// Setup Klaytn SDK + Cloudbric CLBK token contract
const secret = fs.readFileSync(path.join(APP_ROOT_DIR, '.secret.json'));
const parsedSecret = JSON.parse(secret);
const net = parsedSecret.baobabPublicEN;
const Caver = require('caver-js');
const caver = new Caver(net.URL);
const DEPLOYED_ABI = JSON.parse(fs.readFileSync(path.join(APP_ROOT_DIR, 'deployedABI'), 'utf8'));
const DEPLOYED_ADDRESS = fs.readFileSync(path.join(APP_ROOT_DIR, 'deployedAddress'), 'utf8');
const PF = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const KLAYTN = require(path.join(APP_ROOT_DIR, 'config/klaytn'));
 
const d = net.deployer;
const privateKey = d.privateKey;
const address = d.address;
const express = require('express');
const router = express.Router();

const deployer = caver.wallet.newKeyring(address, privateKey);

router.get('/pf', async (req, res, next) => {
  try {
    number = await PF.methods.getBlockNumber().call({from: deployer.address})
    return res.json({
      number: number
    });
  } catch(error) {
    console.error(error);
  }
});

module.exports = router;