const PF = artifacts.require('./ProjectFinance.sol')
const fs = require('fs')

module.exports = function (deployer) {
  deployer.deploy(PF)
    .then(() => {
    // Record recently deployed contract address to 'deployedAddress' file.
    if (PF._json) {
      // Save abi file to deployedABI.
      fs.writeFile(
        'deployedABI',
        JSON.stringify(PF._json.abi, 2),
        (err) => {
          if (err) throw err
          console.log(`The abi of ${PF._json.contractName} is recorded on deployedABI file`)
        })
    }

    fs.writeFile(
      'deployedAddress',
      PF.address,
      (err) => {
        if (err) throw err
        console.log(`The deployed contract address * ${PF.address} * is recorded on deployedAddress file`)
    })
  })
}