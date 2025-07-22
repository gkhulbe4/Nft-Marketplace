/*
  Warnings:

  - You are about to drop the column `owner` on the `Nft` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nftId]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Nft` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Nft_owner_idx";

-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "transferred" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Nft" DROP COLUMN "owner",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_nftId_key" ON "Auction"("nftId");

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
