import { createImageUrl } from "./createImageUrl";
import { createUri } from "./createUri";

interface NFTInfo {
  name: string;
  description: string;
}

interface ImageUploadResult {
  imgIpfs: string;
  imgUrl: string;
}

async function createNft(
  nftInfo: NFTInfo,
  img: File | null
): Promise<{
  imgUrl: string;
  uri: string;
}> {
  if (!nftInfo.name || !nftInfo.description || !img) {
    throw new Error("Please fill in all fields");
  }

  const result: ImageUploadResult | undefined = await createImageUrl(img);
  if (!result) {
    throw new Error("Image upload failed");
  }

  const { imgIpfs, imgUrl } = result;

  const uri: string | undefined = await createUri(nftInfo, imgIpfs);
  if (!uri) {
    throw new Error("Metadata upload failed");
  }
  console.log("Image URL:", imgUrl);
  console.log("IPFS URI:", uri);
  console.log(`https://${import.meta.env.VITE_PINATA_GATEWAY_URL}/ipfs/${uri}`);

  return {
    imgUrl: imgUrl,
    uri: uri,
  };
}
export default createNft;
