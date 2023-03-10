require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();
require('solidity-coverage');
require('hardhat-deploy');
require('@nomicfoundation/hardhat-toolbox');
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// set proxy
// const proxyUrl = '127.0.0.1:7890'; // change to yours, With the global proxy enabled, change the proxyUrl to your own proxy link. The port may be different for each client.
// const { ProxyAgent, setGlobalDispatcher } = require('undici');
// const proxyAgent = new ProxyAgent(proxyUrl);
// setGlobalDispatcher(proxyAgent);

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || '';
const GOERLI_RPC_URL =
  process.env.GOERLI_RPC_URL ||
  'https://eth-mainnet.alchemyapi.io/v2/BYCDM5S8CY3R8AP4EBS4YY1HZMTJ693R1R';
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  '0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.8',
      },
      {
        version: '0.6.6',
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
    customChains: [
      {
        network: 'goerli',
        chainId: 5,
        urls: {
          apiURL: 'http://api-goerli.etherscan.io/api', // https => http
          browserURL: 'http://goerli.etherscan.io',
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  mocha: {
    timeout: 500000,
  },
};
