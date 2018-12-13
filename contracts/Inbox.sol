pragma solidity ^0.4.17;

contract Inbox{
    string public message;

    //构造函数
    function Inbox(string _message) public{
        message = _message;
    }

    function setMessage(string _message) public{
        message = _message;
    }

    function getMessage() public view returns(string){
        return message;
    }

}