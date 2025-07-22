/*
  Warnings:

  - A unique constraint covering the columns `[bidderId,auctionId]` on the table `Bid` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bid_bidderId_auctionId_key" ON "Bid"("bidderId", "auctionId");
