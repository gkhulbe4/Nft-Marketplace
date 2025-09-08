import express from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./lib/prisma";
import { startNftListener } from "./lib/listeners/nftListener";
import { startMarketplaceListener } from "./lib/listeners/marketplaceListener";
import e from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

startNftListener();
startMarketplaceListener();

app.post("/create-nft", async (req, res) => {
  const { name, description, imgUrl, owner } = req.body;

  try {
    const nft = await prisma.nft.create({
      data: { name, description, imgUrl, owner },
    });
    console.log("✅ NFT stored in DB:", nft);
    return res.status(200).json({ message: "success", nft });
  } catch (error) {
    console.error("❌ Error saving NFT:", error);
    return res.status(500).json({ message: "error", error });
  }
});

app.get("/getUserListedNfts", async (req, res) => {
  try {
    const ownerAddress = req.query.address;

    const listedNfts = await prisma.auction.findMany({
      where: {
        nft: {
          owner: {
            // @ts-expect-error
            address: ownerAddress,
          },
        },
        transferred: false,
      },
      select: {
        deadline: true,
        transferred: true,
        active: true,
        currentBid: true,
        highestBidder: true,
        nft: {
          select: {
            id: true,
            name: true,
            description: true,
            imgUrl: true,
            tokenId: true,
          },
        },
      },
    });

    // const nfts = await prisma.nft.findMany({
    //   where: {
    //     owner: {
    //       // @ts-expect-error
    //       address: ownerAddress,
    //     },
    //   },
    //   orderBy: {
    //     createdAt: "desc",
    //   },
    //   include: {
    //     auction: {
    //       select: {
    //         active: true,
    //       },
    //     },
    //   },
    // });
    // console.log(nfts);
    return res.status(200).json({ message: "success", listedNfts });
  } catch (error) {
    console.error("❌ Error saving NFT:", error);
    return res.status(500).json({ message: "error", error });
  }
});

app.get("/getUserCreatedNfts", async (req, res) => {
  try {
    const ownerAddress = req.query.address;

    const createdNfts = await prisma.nft.findMany({
      where: {
        owner: {
          // @ts-expect-error
          address: ownerAddress,
        },
        auction: {
          is: null,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        imgUrl: true,
        tokenId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ message: "success", createdNfts });
  } catch (error) {
    console.error("❌ Error saving NFT:", error);
    return res.status(500).json({ message: "error", error });
  }
});

app.get("/getHotListings", async (req, res) => {
  try {
    const hotListings = await prisma.nft.findMany({
      where: {
        auction: {
          active: true,
          currentBid: {
            not: null,
          },
          deadline: {
            gte: new Date(),
          },
        },
      },
      orderBy: {
        auction: {
          currentBid: "desc",
        },
      },
      include: {
        auction: {
          select: {
            deadline: true,
            currentBid: true,
            highestBidder: true,
            minimumBid: true,
            createdAt: true,
          },
        },
      },
      take: 8,
    });
    // console.log(hotListings);
    return res.status(200).json({ message: "success", hotListings });
  } catch (error) {
    console.error("❌ Error saving NFT:", error);
    return res.status(500).json({ message: "error", error });
  }
});

app.get("/getRecentListings", async (req, res) => {
  try {
    const recentListings = await prisma.nft.findMany({
      where: {
        auction: {
          active: true,
          deadline: {
            gte: new Date(),
          },
        },
      },
      orderBy: {
        auction: {
          createdAt: "desc",
        },
      },
      include: {
        auction: {
          select: {
            deadline: true,
            currentBid: true,
            highestBidder: true,
            minimumBid: true,
            createdAt: true,
          },
        },
      },
      take: 8,
    });
    // console.log(recentListings);
    return res.status(200).json({ message: "success", recentListings });
  } catch (error) {
    console.error("❌ Error saving NFT:", error);
    return res.status(500).json({ message: "error", error });
  }
});

app.get("/getCurrentBiddings", async (req, res) => {
  try {
    const ownerAddress = req.query.address as string;

    if (!ownerAddress) {
      return res.status(400).json({ error: "Address is required" });
    }

    const bids = await prisma.auction.findMany({
      where: {
        highestBidder: ownerAddress,
      },
      select: {
        deadline: true,
        bids: {
          where: {
            bidder: {
              address: ownerAddress,
            },
          },
        },
        nft: {
          select: {
            imgUrl: true,
            name: true,
            tokenId: true,
          },
        },
      },
      orderBy: {
        currentBid: "desc",
      },
    });
    // console.log(bids);

    return res.status(200).json({ message: "success", bids });
  } catch (error) {
    console.error("Error fetching current biddings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getNftBids", async (req, res) => {
  const tokenId = req.query.tokenId;
  try {
    const bids = await prisma.bid.findMany({
      where: {
        auction: {
          nft: {
            tokenId: Number(tokenId),
          },
        },
      },
      select: {
        amount: true,
        timestamp: true,
        bidder: {
          select: {
            address: true,
          },
        },
      },
    });
    // console.log(bids);
    return res.status(200).json({ message: "success", bids });
  } catch (error) {
    console.error("❌ Error saving NFT:", error);
    return res.status(500).json({ message: "error", error });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Working" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:3000`);
});
