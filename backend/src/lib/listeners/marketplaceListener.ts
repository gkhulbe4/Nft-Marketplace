import { ethers } from "ethers";
import "dotenv/config";
import Marketplace from "../abi/Marketplace.json";
import provider from "../provider";
import { prisma } from "../prisma";

export function startMarketplaceListener() {
  const contractAddress = process.env.MARKETPLACE_ADDRESS!;
  const contract = new ethers.Contract(contractAddress, Marketplace, provider);

  contract.on("ItemListed", async (seller, tokenId, minimumBid, deadline) => {
    console.log("🔥 ItemListed event detected:");
    console.log({
      seller,
      tokenId,
      minimumBid,
      deadline,
    });
    const deadlineTimestamp = Number(deadline);
    const modifiedDeadline = new Date(deadlineTimestamp * 1000);

    const nft = await prisma.nft.findUnique({
      where: {
        tokenId: parseInt(tokenId),
      },
    });
    const list = await prisma.auction.create({
      data: {
        deadline: modifiedDeadline,
        minimumBid: Number(minimumBid) / 1e18,
        nftId: nft!.id,
      },
    });
    console.log(list);
  });

  contract.on("BidPlaced", async (bidder, tokenId, amount) => {
    console.log("🔥 BidPlaced event detected:");
    console.log({
      bidder,
      tokenId,
      amount,
    });
    const user = await prisma.user.findUnique({
      where: {
        address: bidder,
      },
    });

    const nft = await prisma.nft.findUnique({
      where: {
        tokenId: Number(tokenId),
      },
    });

    const placedBid = await prisma.auction.update({
      where: {
        nftId: nft!.id,
      },
      data: {
        highestBidder: user!.address,
        currentBid: Number(amount) / 1e18,
      },
    });
    // console.log(placedBid);

    const storeBid = await prisma.bid.upsert({
      where: {
        bidderId_auctionId: {
          bidderId: user!.id,
          auctionId: placedBid.id,
        },
      },
      update: {
        amount: Number(amount) / 1e18,
        timestamp: new Date(),
      },
      create: {
        amount: Number(amount) / 1e18,
        bidderId: user!.id,
        auctionId: placedBid.id,
      },
    });
    // console.log(storeBid);
  });

  console.log("🎧 Marketplace event listener is running...");
}
