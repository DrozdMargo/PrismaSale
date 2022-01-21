const PrismSale = artifacts.require("PrismSale");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("PrismSale", function (accounts) {
  it("should assert true", async function () {
    await PrismSale.deployed();
    return assert.isTrue(true);
  });

  it("should get the right accounts", async function () {
    const contract = await PrismSale.deployed()
    const owner = await contract.owner.call()
    const charity = await contract.charity.call()

    assert.isTrue(owner == 0x97186c73fb6fE39Ab19e754c1Ff4a7D13035d2D1)
    assert.isTrue(charity == 0x95CD468E97e14579B7C7203edB28034B078f9f58)
  });

  it("should split the payment", async function () {
    const contract = await PrismSale.deployed();

    const startBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]))

    const purchase = await contract.buy.sendTransaction({
      from: accounts[1],
      value: web3.utils.toWei("0.01", "ether")
    });

    const commission = web3.utils.toBN(web3.utils.toWei("0.008", "ether"))
    const endBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]))

    assert.equal(
        startBalance.add(commission).toString(),
        endBalance.toString()
    )

    console.log(startBalance)
    console.log(endBalance)
  })


});
