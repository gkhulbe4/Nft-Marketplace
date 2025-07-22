-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "currentBid" DECIMAL(65,30),
ADD COLUMN     "highestBidder" TEXT;
