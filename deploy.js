// 部署智能合约的脚本
const Web3 = require('web3');
const {interface,bytecode} = require('./compile');
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "ketchup divorce chief dutch inside found section myself grace pen cover half"; // 12 word mnemonic
var provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/7d3e4b26c9c54418858fd4f721c5ac8b");

// Or, alternatively pass in a zero-based address index.
//var provider = new HDWalletProvider(mnemonic, "http://localhost:8545", 5);
const web3 = new Web3(provider);

deploy = async() =>{
  const accounts =await web3.eth.getAccounts();
  console.log(accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
          /*
          不加前缀'0x'出错：UnhandledPromiseRejectionWarning: Error: The contract code couldn't be stored, please check your gas limit.
           */
        data:'0x'+bytecode,
        arguments: ['Hello,Inbox!The first smart contract!']
      }).send({
          from:accounts[0],
          gas: 3000000
      });
  console.log('Address: '+result.options.address);
};

deploy();