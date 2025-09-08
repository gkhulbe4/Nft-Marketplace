import { ethers } from "ethers";
import "dotenv/config";
import Marketplace from "../abi/Marketplace.json";
import provider from "../provider";
import { prisma } from "../prisma";
import { PrismaClient } from "../../../generated/prisma";

type TxClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export function startMarketplaceListener() {
  const contractAddress = process.env.MARKETPLACE_ADDRESS!;
  const contract = new ethers.Contract(contractAddress, Marketplace, provider);

  contract.on(
    "ItemListed",
    async (
      seller: string,
      tokenId: string,
      minimumBid: string,
      deadline: string
    ) => {
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
          transferred: false,
        },
      });
      console.log(list);
    }
  );

  contract.on(
    "BidPlaced",
    async (bidder: string, tokenId: string, amount: string) => {
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
    }
  );

  contract.on(
    "AuctionClosed",
    async (tokenId: string, winner: string, finalPrice: string) => {
      console.log("🔥 AuctionClosed event detected:");
      console.log({ tokenId, winner, finalPrice });

      const tokenIdNum = Number(tokenId);

      try {
        await prisma.$transaction(async (tx: TxClient) => {
          const newOwner = await tx.user.findUnique({
            where: { address: winner },
          });

          if (!newOwner) throw new Error("Winner not found in users table");

          const nft = await tx.nft.findUnique({
            where: { tokenId: tokenIdNum },
          });

          if (!nft) throw new Error("NFT not found");

          const updatedNft = await tx.nft.update({
            where: { tokenId: tokenIdNum },
            data: { ownerId: newOwner.id },
          });

          const deletedAuction = await tx.auction.delete({
            where: { nftId: nft.id },
          });

          await tx.bid.deleteMany({
            where: { auctionId: deletedAuction.id },
          });
        });

        console.log("✅ Auction closed and DB updated successfully");
      } catch (error) {
        console.error("❌ Error handling AuctionClosed event:", error);
      }
    }
  );

  console.log("🎧 Marketplace event listener is running...");
}
