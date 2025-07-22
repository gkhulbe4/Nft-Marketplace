// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {CustomNFT} from "../src/CustomNFT.sol";

contract MarketplaceScript is Script {
    Marketplace public m;
    CustomNFT public c;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        m = new Marketplace(address(0));
        c = new CustomNFT(address(m));
        m.setNftAddress(address(c));

        console.log("Marketplace Address: %s", address(m));
        console.log("CustomNFT Address: %s", address(c));

        vm.stopBroadcast();
    }
}
