const Token = artifacts.require("Token");

module.exports = function (deployer) {
  deployer.deploy(Token, 'MATINJIRI', 'JIRI', 0, 100000000,200000000);

};


