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

router.get('/pf/project/:projectId', async (req, res, next) => {
    const hex = caver.utils.asciiToHex(req.params.projectId);
    const projectId = caver.abi.encodeParameter('bytes32', caver.utils.padRight(hex, 64));
    try {
        project = await PF.methods.projects(projectId).call();
        console.log(project)
        ret = {};
        ret.projectId = caver.utils.hexToUtf8(project.projectId);
        ret.pfBanker = project.pfBanker
        ret.pfEnforcer = project.pfEnforcer;
        ret.pfConstructor = project.pfConstructor;
        console.log(project.stepList);
        return res.status(200).json(ret);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error)
    }
});

router.post('/pf/project', async (req, res, next) => {
    const projectId = caver.utils.asciiToHex(req.body.projectId);
    const pfBanker = req.body.pfBanker;
    const pfEnforcer = req.body.pfEnforcer;
    const pfConstructor = req.body.pfConstructor;
    const abiCreateProject = PF.methods.createProject(
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(projectId, 64)),
        pfBanker,
        pfEnforcer,
        pfConstructor
    ).encodeABI();
    const smartContractExecutionTx = new caver.transaction.smartContractExecution({
        from: deployer.address,
        to: DEPLOYED_ADDRESS,
        input: abiCreateProject,
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

router.get('/pf/project/:projectId/steps-length', async (req, res, next) => {
    const hex = caver.utils.asciiToHex(req.params.projectId);
    const projectId = caver.abi.encodeParameter('bytes32', caver.utils.padRight(hex, 64));
    try {
        length = await PF.methods.getStepsLength(projectId).call();
        return res.status(200).json({'length': length});
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});

router.get('/pf/project/:projectId/step/:index', async (req, res, next) => {
    const projectIdHex = caver.utils.asciiToHex(req.params.projectId);
    const projectId = caver.abi.encodeParameter('bytes32', caver.utils.padRight(projectIdHex, 64));
    const index = caver.abi.encodeParameter('uint256', req.params.index);
    try {
        step = await PF.methods.getStep(projectId, index).call();
        ret = {};
        ret.stepId = caver.utils.hexToUtf8(step.stepId);
        ret.procgressPercentage = step.progressPercentage;
        ret.amountOfMoney = step.amountOfMoney;
        ret.currency = caver.utils.hexToUtf8(step.currency);
        return res.status(200).json(ret);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
})

router.post('/pf/project/step', async (req, res, next) => {
    const stepId = caver.utils.asciiToHex(req.body.stepId);
    const projectId = caver.utils.asciiToHex(req.body.projectId);
    const progressPercentage = req.body.progressPercentage;
    const amountOfMoney = req.body.amountOfMoney;
    const currency = caver.utils.asciiToHex(req.body.currency);
    const abiCreateProject = PF.methods.addStepToProject(
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(stepId, 64)),
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(projectId, 64)),
        caver.abi.encodeParameter('int32', progressPercentage),
        caver.abi.encodeParameter('int32', amountOfMoney),
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(currency, 64)),
    ).encodeABI();
    const smartContractExecutionTx = new caver.transaction.smartContractExecution({
        from: deployer.address,
        to: DEPLOYED_ADDRESS,
        input: abiCreateProject,
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
