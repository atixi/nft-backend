const Web3 = require('web3');
const { OpenSeaPort, Network } = require('opensea-js');

module.exports = {
  seaport()
{
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/c2dde5d7c0a0465a8e994f711a3a3c31')
    const seaport = new OpenSeaPort(provider, {
      networkName: Network.Rinkeby,
      apiKey: "c2dde5d7c0a0465a8e994f711a3a3c31",
    });

  //   {
  //     const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/c2dde5d7c0a0465a8e994f711a3a3c31')
  //     const seaport = new OpenSeaPort(provider, {
  //       networkName: Network.Main,
  //       apiKey: "2e7ef0ac679f4860bbe49a34a98cf5ac", 
  //     });
  //     return seaport;
  // }
    return seaport;
}
}
