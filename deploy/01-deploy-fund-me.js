//import
//main function
//calling of main function

const { hexStripZeros } = require('ethers/lib/utils');
const { network } = require('hardhat');
const { verify } = require('../utils/verify');
//如何导入其他配置文件的内容并使用(两种写法)
//const {networkConfig} = require("../helper-hardhat-config");

// const helperConfig = require('../helper-hardhat-config');
// const networkConfig = helperConfig.networkConfig;

const {
  networkConfig,
  developmentChains,
} = require('../helper-hardhat-config');

//部署的三种写法：
//1.简易写法

// function deployFunc(hre) {
//     console.log("hi this is deploy!!");
//     hre.getNamedAccounts();
//     hre.deployments;
// }

// module.exports.default = deployFunc

//----------------------------------

//2.
// module.exports = async (hre) => {
//     const { getNameAccounts, deployments } = hre
// }

//---------------------------------------------

//3.
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //if chainId is A then use address X
  //if chainId is B then use address Y

  //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  let ethUsdPriceFeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get('MockV3Aggregator');
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed'];
  }
  log('----------------------------------------------------');
  log('Deploying FundMe and waiting for confirmations...');
  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy('FundMe', {
    from: deployer,
    args: args,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`FundMe deployed at ${fundMe.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
};
module.exports.tags = ['all', 'fundme'];
