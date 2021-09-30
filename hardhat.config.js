require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const mumbaiNetwork = process.env.MUMBAI_ID_NETWORK;
const mainnetNetwork = process.env.POLYGON_ID_MAINNET;
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${mumbaiNetwork}`,
      accounts: [privateKey],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${mainnetNetwork}`,
      accounts: [privateKey],
    },
  },
  solidity: "0.8.4",
};
