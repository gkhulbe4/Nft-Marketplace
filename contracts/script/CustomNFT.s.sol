// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CustomNFT} from "../src/CustomNFT.sol";

contract CounterScript is Script {
    CustomNFT public c;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        c = new CustomNFT(address(0));

        vm.stopBroadcast();
    }
}
