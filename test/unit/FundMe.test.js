const { deployments, ethers, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai');

describe('FundMe', async function () {
  let fundMe;
  let deployer;
  let mockV3Aggregator;
  const sendValue = ethers.utils.parseEther('1');

  beforeEach(async function () {
    // const { deployer } = await getNamedAccounts();
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(['all']);
    fundMe = await ethers.getContract('FundMe', deployer);
    mockV3Aggregator = await ethers.getContract('MockV3Aggregator', deployer);
  });

  describe('constructor', async function () {
    it('sets the aggregator address correctly', async function () {
      const response = await fundMe.getPriceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });

  describe('fund', async function () {
    it('make sure it will revert when you send not enough eth value', async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        'You need to spend more ETH!'
      );
    });

    it('make sure the amount funder data structure have updated', async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.getAddressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });

    // it('make sure the sender have been pushed into funders data structure', async function () {
    //   await fundMe.fund({ value: sendValue });
    //   const funder = fundMe.funders(0);
    //   assert.equal(funder, deployer);
    // });
  });

  describe('withdraw', function () {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });
    it('Withdraw ETH from a single funder', async () => {
      // Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      // Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait();

      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

      // Assert
      // Maybe clean up to understand the testing
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    // this test is overloaded. Ideally we'd split it into multiple tests
    // but for simplicity we left it as one

    // it('Only allows the owner to withdraw', async function () {
    //   const accounts = await ethers.getSigners();
    //   const fundMeConnectedContract = await fundMe.connect(accounts[1]);
    //   await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
    //     'FundMe__NotOwner'
    //   );
    // });
  });
});
