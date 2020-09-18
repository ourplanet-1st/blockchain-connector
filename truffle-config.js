const HDWalletProvider = require('truffle-hdwallet-provider-klaytn');
const fs = require('fs');

const secret = fs.readFileSync(".secret.json").toString();
const parsedSecret = JSON.parse(secret);

const BAOBAB_NETWORK_ID = '1001';
const BAOBAB_DEPLOYER = parsedSecret.baobabPublicEN.deployer;
const BAOBAB_URL = parsedSecret.baobabPublicEN.URL;

module.exports = {
    networks: {
        baobab: {
            provider: () => new HDWalletProvider(BAOBAB_DEPLOYER.privateKey, BAOBAB_URL),
            network_id: BAOBAB_NETWORK_ID,
            gas: '8500000',
            gasPrice: null,
        },
    },

    // Set default mocha options here, use special reporters etc.
    mocha: {
        // timeout: 100000
    },

    // Configure your compilers
    compilers: {
        solc: {
            version: "0.5.1", // Fetch exact version from solc-bin (default: truffle's version)
            docker: true, // Use "0.5.1" you've installed locally with docker (default: false)
        }
    }
}
