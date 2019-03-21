var ProducerRole = artifacts.require("./FarmerRole.sol");
var PharmacyRole = artifacts.require("./DistributorRole.sol");
var ConsumerRole = artifacts.require("./RetailerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function (deployer) {
 deployer.deploy(ProducerRole);
 deployer.deploy(PharmacyRole);
 deployer.deploy(ConsumerRole);
 deployer.deploy(SupplyChain);
}