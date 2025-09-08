import { ethers } from "ethers";
import "dotenv/config";
import CustomNFT from "../abi/CustomNFT.json";
import provider from "../provider";
import { prisma } from "../prisma";

export function startNftListener() {
  const contractAddress = process.env.CUSTOM_NFT_ADDRESS!;
  const contract = new ethers.Contract(contractAddress, CustomNFT, provider);

  contract.on(
    "TokenCreated",
    async (
      tokenId: string,
      owner: string,
      imgUrl: string,
      name: string,
      description: string
    ) => {
      console.log("🔥 TokenCreated event detected:");
      console.log({
        tokenId,
        owner,
        imgUrl,
        name,
        description,
      });
      let nft;

      const userExists = await prisma.user.findUnique({
        where: {
          address: owner,
        },
      });

      if (userExists) {
        nft = await prisma.nft.create({
          data: {
            tokenId: parseInt(tokenId),
            imgUrl: imgUrl,
            name: name,
            description: description,
            ownerId: userExists.id,
          },
        });
      } else {
        nft = await prisma.user.create({
          data: {
            address: owner,
            nfts: {
              create: {
                imgUrl: imgUrl,
                tokenId: parseInt(tokenId),
                name: name,
                description: description,
              },
            },
          },
        });
      }
      // console.log(nft);
    }
  );

  // contract.on("*", (event) => {
  //   try {
  //     console.log(event);
  //     console.log("Event received:", event.eventName, event.args);
  //     console.dir(event, { depth: null });
  //   } catch (err) {
  //     console.error("⚠️ Error decoding event:", err);
  //   }
  // });

  console.log("🎧 NFT event listener is running...");
}
