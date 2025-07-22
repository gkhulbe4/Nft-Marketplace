export async function createImageUrl(img: File) {
  try {
    const formData = new FormData();
    formData.append("file", img);
    formData.append("network", "public");
    const response = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: formData,
    });
    const result = await response.json();
    // console.log(result.data.cid);
    const imgIpfs = `ipfs://${result.data.cid}`;
    const imgUrl = `https://${import.meta.env.VITE_PINATA_GATEWAY_URL}/ipfs/${
      result.data.cid
    }`;
    // console.log({ imgIpfs, imgUrl });
    return { imgIpfs, imgUrl };
  } catch (error) {
    console.log(error);
  }
}
