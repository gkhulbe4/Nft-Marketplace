// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CustomNFT} from "../src/CustomNFT.sol";
import {Marketplace} from "../src/Marketplace.sol";

contract MarketplaceTest is Test {
    Marketplace public m;
    CustomNFT public c;
    address user1 = address(0x5aE1fbD995B32D2e4C4733D36A45b346E3dABb2E);
    address user2 = address(0xf353078C5637E48B6E49F0c6ecc68140feBB54c6);
    address user3 = address(0x426BbFe48f950d7EA375dbCa214f67Ed97Bd0aD0);

    function setUp() public {
        c = new CustomNFT(address(0));
        m = new Marketplace(address(c));
        m.setNftAddress(address(c));
    }

    function test_listItem() public {
        vm.startPrank(user1);
        vm.deal(user1, 10 ether);
        uint256 tokenId = c.createNFT(
            "ipfs://bafkreifvzz4oppbshehuwua22jab3czyhovyuajahzeavgyb3ilnzktk64", "sdsd", "bandar", "monkey"
        );
        c.approve(address(m), tokenId);
        m.listItem(tokenId, 1 ether, 60000);
        (address seller, uint256 minimumBid, address highestBidder, uint256 highestBid, uint256 deadline, bool active) =
            m.auctions(tokenId);

        assertEq(seller, user1);
        assertEq(minimumBid, 1 ether);
        assertEq(highestBidder, address(0));
        assertEq(highestBid, 0);
        assertEq(deadline, block.timestamp + 60000);
        assertEq(active, true);

        // console.log("Token Id: %s", tokenId);
        // console.log("Seller: %s", seller);
        // console.log("Min Bid: %s", minimumBid);
        // console.log("Highest Bidder: %s", highestBidder);
        // console.log("Highest Bid: %s", highestBid);
        // console.log("Deadline: %s", deadline);
        // console.log("Active: %s", active);
    }

    function test_bid() public {
        vm.startPrank(user1);
        vm.deal(user1, 10 ether);
        uint256 tokenId = c.createNFT(
            "ipfs://bafkreifvzz4oppbshehuwua22jab3czyhovyuajahzeavgyb3ilnzktk64", "sdsd", "bandar", "monkey"
        );
        c.approve(address(m), tokenId);
        m.listItem(tokenId, 1 ether, 60000);
        vm.stopPrank();

        vm.startPrank(user2);
        vm.deal(user2, 10 ether);
        m.placeBid{value: 2 ether}(tokenId);
        vm.stopPrank();

        vm.startPrank(user3);
        vm.deal(user3, 10 ether);
        m.placeBid{value: 3 ether}(tokenId);
        vm.stopPrank();

        (,, address highestBidder, uint256 highestBid,,) = m.auctions(tokenId);

        console.log("Highest Bidder: %s", highestBidder);
        console.log("Highest Bid: %s", highestBid);
        assertEq(highestBid, 3 ether);
        assertEq(highestBidder, user3);
    }

    function test_closeAuction() public {
        vm.startPrank(user1);
        vm.deal(user1, 10 ether);
        uint256 tokenId = c.createNFT(
            "ipfs://bafkreifvzz4oppbshehuwua22jab3czyhovyuajahzeavgyb3ilnzktk64", "sdsd", "bandar", "monkey"
        );
        console.log("Old Owner : %s", c.ownerOf(0));
        c.approve(address(m), tokenId);
        m.listItem(tokenId, 1 ether, 60000);
        vm.stopPrank();

        vm.startPrank(user2);
        vm.deal(user2, 10 ether);
        m.placeBid{value: 2 ether}(tokenId);
        vm.stopPrank();

        vm.startPrank(user3);
        vm.deal(user3, 10 ether);
        m.placeBid{value: 3 ether}(tokenId);
        vm.stopPrank();

        vm.warp(block.timestamp + 60001);
        vm.prank(user1);
        m.closeAuction(tokenId);

        console.log("New Owner : %s", c.ownerOf(tokenId));
    }
}
