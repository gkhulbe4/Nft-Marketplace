// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CustomNFT} from "../src/CustomNFT.sol";

contract CounterTest is Test {
    CustomNFT public c;
    address user1 = address(0x5aE1fbD995B32D2e4C4733D36A45b346E3dABb2E);
    address user2 = address(0xf353078C5637E48B6E49F0c6ecc68140feBB54c6);

    function setUp() public {
        c = new CustomNFT(address(0));
    }

    function test_CreateNFT() public {
        vm.startPrank(user1);
        vm.deal(user1, 10 ether);
        uint256 tokenId = c.createNFT(
            "ipfs://bafkreifvzz4oppbshehuwua22jab3czyhovyuajahzeavgyb3ilnzktk64"
        );
        console.log(tokenId);
        console.log(c.ownerOf(0));
        assertEq(c.totalSupply(), 1);
    }

    function test_TransferNFT() public {
        vm.startPrank(user1);
        vm.deal(user1, 10 ether);
        uint256 tokenId = c.createNFT(
            "ipfs://bafkreifvzz4oppbshehuwua22jab3czyhovyuajahzeavgyb3ilnzktk64"
        );
        c.transferFrom(user1, user2, tokenId);
        assertEq(c.ownerOf(tokenId), user2);
    }
}
