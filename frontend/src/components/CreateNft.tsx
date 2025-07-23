import { useState } from "react";
import { toast } from "sonner";
import createNft from "../lib/actions/createNft";
import { useAccount, useWriteContract } from "wagmi";
import CustomNFT from "../lib/abi/CustomNFT.json";
import { waitForTransactionReceipt } from "viem/actions";
import { publicClient } from "@/lib/publicClient";
import { Loader } from "lucide-react";
import NoWallet from "./NoWallet";

function CreateNft() {
  const [nftInfo, setNftInfo] = useState({ name: "", description: "" });
  const [img, setImg] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);

  const { error, writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  if (address === undefined) {
    return <NoWallet />;
  }

  async function handleCreateNft() {
    try {
      if (!nftInfo.name || !nftInfo.description || !img) {
        toast.info("Please fill in all fields");
        return;
      }
      setLoader(true);
      if (!address) return;
      const { imgUrl, uri } = await createNft(nftInfo, img);

      const tx = await writeContractAsync({
        address: import.meta.env.VITE_CUSTOM_NFT_ADDRESS,
        abi: CustomNFT,
        functionName: "createNFT",
        args: [uri, imgUrl, nftInfo.name, nftInfo.description],
      });
      console.log("tx", tx);

      const receipt = await waitForTransactionReceipt(publicClient, {
        hash: tx,
      });
      console.log("✅ Transaction confirmed:", receipt);
      if (receipt.status === "success") {
        toast.success("NFT created successfully!");
        setNftInfo({ name: "", description: "" });
        setImg(null);
        setPreviewUrl(null);
        return;
      } else {
        toast.error("NFT creation failed!");
        console.log(error);
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoader(false);
    }
  }

  return (
    <div className="min-h-screen p-8 bg-black text-white flex justify-center items-center">
      <div className="grid md:grid-cols-2 gap-8 bg-[#141414] p-6 rounded-xl shadow-lg w-full max-w-4xl border border-[#333]">
        <div className="flex items-center justify-center bg-[#364151] rounded-lg overflow-hidden border border-[#333]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="NFT Preview"
              className="object-cover w-full h-64 md:h-auto"
            />
          ) : (
            <p className="text-gray-400 text-center">No image selected</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">NFT Name</label>
            <input
              type="text"
              placeholder="Enter NFT Name"
              className="w-full px-4 py-2 text-sm rounded bg-[#1f1f1f] text-gray-300 placeholder-gray-500 outline-none border border-[#333]"
              value={nftInfo.name}
              onChange={(e) => setNftInfo({ ...nftInfo, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">NFT Description</label>
            <textarea
              rows={4}
              placeholder="Enter NFT Description"
              className="w-full px-4 py-2 text-sm rounded bg-[#1f1f1f] text-gray-300 placeholder-gray-500 outline-none border border-[#333] resize-none"
              value={nftInfo.description}
              onChange={(e) =>
                setNftInfo({ ...nftInfo, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">NFT Image</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full px-4 py-2 text-sm rounded bg-[#1f1f1f] text-gray-500 placeholder-gray-500 outline-none border border-[#333]"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImg(file);
                  const localUrl = URL.createObjectURL(file);
                  setPreviewUrl(localUrl);
                }
              }}
            />
          </div>

          <button
            disabled={loader}
            className={`w-full mt-4 py-2 rounded bg-[#f3cd75] hover:bg-[#f8c347] text-black font-semibold transition duration-300  cursor-pointer ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 `}
            onClick={handleCreateNft}
          >
            {loader ? (
              <div className="flex items-center justify-center gap-2">
                <p>Creating NFT</p>
                <Loader className="animate-spin" />
              </div>
            ) : (
              "Create NFT"
            )}
          </button>
          {loader && (
            <p className="text-sm text-gray-400 text-center">
              This may take upto 1-2 minutes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateNft;
