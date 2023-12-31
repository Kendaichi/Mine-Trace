const ProductionStorage = artifacts.require("ProductionStorage");

module.exports = function (deployer) {
  deployer.deploy(ProductionStorage);
};
