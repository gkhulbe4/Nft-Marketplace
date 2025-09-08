import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
});

export default pinata;
