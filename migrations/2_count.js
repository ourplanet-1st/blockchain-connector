const fs = require('fs');
const Count = artifacts.require("Count");

module.exports = function(deployer) {
  deployer
    .deploy(Count)
    .then(() => {
      let contractName = undefined;

      if (Count._json) {
        fs.writeFile(
          'metadataOfCount',
          JSON.stringify(Count._json, 2),
          (err) => {
            if (err) throw err
            contractName = Count._json.contractName
            console.log(`The metadata of ${contractName} is recorded on ${contractName} file`)
          }
        );
      }
      fs.writeFile(
        'addressOfCount',
        Count.address,
        (err) => {
          if (err) throw err
          console.log(`The deployed address of ${contractName} is ${Count.address}`)
        }
      );
    });
}