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
const KLAYTN = require(path.join(APP_ROOT_DIR, 'config/klaytn'));

const PF = new caver.contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

const d = net.deployer;
const privateKey = d.privateKey;
const address = d.address;
const express = require('express');
const router = express.Router();

const deployer = caver.wallet.newKeyring(address, privateKey);

router.get('/pf/bank-account/:address', async (req, res, next) => {
    const address = req.params.address;
    try {
        bankAccount = await PF.methods.bankAccounts(address).call();
        ret = {};
        ret.name = caver.utils.hexToUtf8(bankAccount.name);
        ret.accountNumber = caver.utils.hexToUtf8(bankAccount.accountNumber);
        return res.status(200).json(ret);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error)
    }
});

router.post('/pf/bank-account', async (req, res, next) => {
    const address = req.body.address;
    const name = caver.utils.asciiToHex(req.body.name);
    const accountNumber = caver.utils.asciiToHex(req.body.accountNumber);
    const abiCreateBankAccount = PF.methods.createBankAccount(
        address,
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(name, 64)),
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(accountNumber, 64)),
    ).encodeABI();
    const smartContractExecutionTx = new caver.transaction.smartContractExecution({
        from: deployer.address,
        to: DEPLOYED_ADDRESS,
        input: abiCreateBankAccount,
        gas: KLAYTN.GAS_LIMIT,
    });
    let receipt = undefined;
    try {
        await caver.wallet.sign(deployer.address, smartContractExecutionTx);
        const receipt = await caver.rpc.klay.sendRawTransaction(smartContractExecutionTx.getRLPEncoding());
        return res.status(200).json(receipt);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});


module.exports = router;
