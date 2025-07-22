import pinata from "../pinata";

export async function createUri(
  nftInfo: { name: string; description: string },
  imgIpfs: string
) {
  try {
    const metadata = {
      name: nftInfo.name,
      description: nftInfo.description,
      image: imgIpfs,
    };

    const upload = await pinata.upload.public.json(metadata);
    const cid = upload.cid;
    const url = `ipfs://${cid}`;
    return url;
  } catch (error) {
    console.log(error);
  }
}
