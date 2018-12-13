/*
class Dog {
    say(){
        return 'wangwang';
    }
    happy(){
        return 'miaomiao';
    }
}
const assert = require('assert');

let dog;
beforeEach(()=>{
    dog = new Dog();
});
describe('测试dog',()=>{
    it('测试 dog的say方法',()=>{
        //const dog = new Dog();
        //console.log(dog.say());
        assert.equal(dog.say(),'wangwang');
    });
    it('测试 dog的happy方法',()=>{
        //const dog = new Dog();
        //console.log(dog.happy());
        assert.equal(dog.happy(),'miaomiao');
    });
});
*/
const assert = require('assert');
const ganache = require('ganache-cli');
const {interface,bytecode} = require('../compile'); //从编译文件中获取interface和bytecode的信息
//约定的规范，如果变量以大写字母开头，它就是一个构造方法（构造函数）
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());//将ganache测试网络的卡插入web3里面

//在此之前需要更新一个bignumber.js库，命令如下：npm install --save bignumber.js
const BigNumber = require('bignumber.js');
describe('测试智能合约',()=>{
    it('测试Web3的版本号',()=>{
        console.log(web3.version);
    });
    // it('测试Web3的API',()=>{
    //     console.log(web3.currentProvider);
    // });
    it('测试Web3常见的API', function () {
        var str = 'abcD';
        var obj = {abc:'ABC'};
        var bigNumber = new BigNumber('54687642568');
        // 测试转换为十六进制的API函数：toHex()
        var hstr = web3.utils.toHex(str);
        var hobj = web3.utils.toHex(obj);
        var hbigN = web3.utils.toHex(bigNumber);

        console.log(hstr);//0x61626344
        console.log(hobj);//0x7b22616263223a22414243227d
        console.log(hbigN);//0xcbba333c8

        //测试将十六进制转换为Ascii码的字母
        var astr = web3.utils.hexToAscii(hstr);
        console.log(astr);//abcD

        //测试将Ascii码对应的字母转化为十六进制,注意：fromAscii已被弃用
        var hhstr = web3.utils.asciiToHex(astr);
        console.log(hhstr);//0x61626344

        //将以太币从其他单位转化为以Wei为单位
        var value = web3.utils.toWei('1','ether');// 1 ether=1000000000000000000 wei
        console.log(value);//1000000000000000000

        //将以太币从以Wei为单位转化为其他单位
        var value1 = web3.utils.fromWei('1','ether');// 1 wei=0.000000000000000001 ether
        console.log(value1);//0.000000000000000001

        var value2 = web3.utils.fromWei('1','mwei');// 1 wei=0.000001 mwei
        console.log(value2);//0.000001

        //获取账户的以太币余额
          //注意：下面的console.log()输出完之后，才会输出then中的console.log
        var balance = web3.eth.getBalance("0x7598615Ae0Bd71E9D3CA951CAF10f0Ba5c1d48E4").then(console.log);
        console.log(balance);//Promise { <pending> }
        console.log(balance.toString(10));//[object Promise]
        console.log('number:'+balance.toNumber);//number:undefined
        //如果写成balance.toNumber()会报错：TypeError: balance.toNumber is not a function

        //获取以太币的账户
        var balance = web3.eth.getAccounts().then(
            (accounts)=>{
                console.log(accounts);
            }
        );
    });

    // ES6的新写法（async表示异步执行）
    it('测试web3的API',async()=>{
        const account = await web3.eth.getAccounts();
        console.log(account);
        const money = await web3.eth.getBalance(account[0]);
        console.log(await web3.utils.fromWei(money,'ether'));
        });

    // 测试部署智能合约
    it('测试部署智能合约',async()=>{
        const account = await web3.eth.getAccounts();
        const inbox = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({
                data:bytecode,
                arguments:['Hello,Inbox'] //对应于智能合约Inbox中的构造函数Inbox中的形参_message
            }).send({
                from: account[0],
                gas:1000000
            });
        console.log('Addres: '+inbox.options.address);

        // 测试智能合约中的方法
            /*
             let表示变量，const表示常量，不修改信息的使用call()，修改的使用send();
             call方法不用花费以太币，send方法需要花费以太币
              */
        let message =await inbox.methods.getMessage().call();
        console.log(message);
        assert.equal(message,'Hello,Inbox');

        await inbox.methods.setMessage('Testing set a new message').send({
            from: account[0],
            gas:1000000
        });

        message =await inbox.methods.getMessage().call();
        console.log(message);
        assert.equal(message,'Testing set a new message');



    });
});