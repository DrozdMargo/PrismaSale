const Migrations = artifacts.require("PrismSale");

module.exports = function (deployer) {
    deployer.deploy(Migrations);
};
