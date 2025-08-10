# 🖼️ BidVerse - NFT Auction Marketplace

A full-stack decentralized application (DApp) that lets users **mint NFTs**, **list them for timed auctions**, **place bids**, and **close auctions manually**. Built using **Solidity**, **React**, **Node.js**, and **Alchemy WebSocket RPC** for event-driven backend updates.

---

## Project video :- https://www.linkedin.com/feed/update/urn:li:activity:7353864784766816259/

---

## ✨ Features

- 🔨 **Mint NFTs** (ERC-721) with metadata and image stored on **IPFS**
- ⏱ **List NFTs for auction** with a custom deadline and minimum bid
- 💰 **Place live bids**, previous highest bid is automatically refunded
- 🔄 **Real-time UI updates** using on-chain data
- 🔔 **Backend listens to contract events** using WebSockets (Alchemy RPC)
- 📦 **Auction closure** is manual — allows NFT to transfer + payout
- 📊 Admin-friendly backend using Prisma + PostgreSQL

---

## 🧰 Tech Stack

### 🔗 Smart Contracts

- Solidity (`ERC721`, `Ownable`, `ReentrancyGuard`)
- Custom `Marketplace` contract

### 🎨 Frontend

- React + TypeScript
- Tailwind CSS + shadcn/ui
- Wagmi + Viem for contract interaction
- IPFS (Pinata) for NFT image hosting

### 🧠 Backend

- Node.js + TypeScript
- Prisma ORM + PostgreSQL
- **Alchemy WebSocket** for listening to contract events
- Ethers.js for decoding and handling event logs

