// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Context {
    constructor() public {}

    function _msgSender() internal view returns (address) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this;
        return msg.data;
    }
}
