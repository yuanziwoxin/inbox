// 编译智能合约的脚本（https://www.npmjs.com/package/solc）
const path = require('path'); //获取path模块
const fs = require('fs'); //获取文件系统模块
const solc= require('solc'); //获取solc模块

// 获取文件的路径，_dirname表示工程目录
const srcpath = path.resolve(__dirname,'contracts','Inbox.sol');
//console.log(srcpath); 打印文件地址

// 通过文件系统同步读取文件
const source = fs.readFileSync(srcpath,'utf-8');
//console.log(source); 打印文件内容

// 利用solc编译智能合约
const result = solc.compile(source,1);
//console.log(result); 打印编译结果


module.exports = result.contracts[':Inbox'];

