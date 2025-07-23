import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import Marketplace from "../../lib/abi/Marketplace.json";
import CustomNFT from "../../lib/abi/CustomNFT.json";
import { toast } from "sonner";
import { waitForTransactionReceipt } from "viem/actions";
import { publicClient } from "@/lib/publicClient";
import { queryClient } from "@/lib/queryClient";
import { Loader } from "lucide-react";
import getTimeRemaining from "@/lib/getTimeRemaining";

function ListDialog({
  tokenId,
  active,
  address,
  deadline,
}: {
  tokenId: number;
  active: boolean;
  address: string;
  deadline: string;
}) {
  const [listInfo, setListInfo] = useState({
    minimumBid: 0,
    hours: 0,
    days: 0,
  });
  const [loader, setLoader] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { error, writeContractAsync } = useWriteContract();

  async function handleList() {
    console.log(listInfo.hours);
    if (
      !tokenId ||
      listInfo.minimumBid <= 0 ||
      (listInfo.hours <= 0 && listInfo.days <= 0)
    ) {
      toast.info("Please enter valid details");
      return;
    }
    const duration = Math.floor(listInfo.hours * 3600) + listInfo.days * 86400;
    try {
      setLoader(true);
      const approvalTx = await writeContractAsync({
        address: import.meta.env.VITE_CUSTOM_NFT_ADDRESS,
        abi: CustomNFT,
        functionName: "approve",
        args: [import.meta.env.VITE_MARKETPLACE_ADDRESS, tokenId],
      });
      console.log("Approval :", approvalTx);

      await waitForTransactionReceipt(publicClient, {
        hash: approvalTx,
      });

      const listingTx = await writeContractAsync({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS,
        abi: Marketplace,
        functionName: "listItem",
        args: [tokenId, listInfo.minimumBid * 1e18, duration],
      });
      const receipt = await waitForTransactionReceipt(publicClient, {
        hash: listingTx,
      });
      console.log("✅ Transaction confirmed:", receipt);
      if (receipt.status === "success") {
        toast.success("NFT listed successfully!");
        queryClient.invalidateQueries({
          queryKey: ["userListedNfts", address],
        });
        queryClient.invalidateQueries({ queryKey: ["recentListings"] });
        queryClient.invalidateQueries({
          queryKey: ["userCreatedNfts", address],
        });
        return;
      } else {
        toast.error("NFT listing failed!");
        console.log(error);
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoader(false);
      setDialogOpen(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setDialogOpen(true)}
          disabled={active}
          className={`w-full h-full font-semibold text-sm px-4 rounded ${
            active
              ? "bg-gray-300 text-gray-600 "
              : "bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
          }`}
        >
          {active ? (
            <>
              <p>Ending in {getTimeRemaining(deadline)}</p>
            </>
          ) : (
            "List NFT"
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#141414] rounded-lg shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#f3cd75]">
            List Your NFT
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-300">
            After listing, others will be able to place bids on your NFT.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#f3cd75] mb-1">
              Minimum Bid (ETH)
            </label>
            <input
              onChange={(e) =>
                setListInfo({ ...listInfo, minimumBid: Number(e.target.value) })
              }
              className="w-full border border-[#333] text-white rounded-md px-3 py-2 text-sm outline-none bg-[#1f1f1f] "
              type="number"
              min={0}
              placeholder="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f3cd75] mb-1">
              Duration
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                onChange={(e) =>
                  setListInfo({ ...listInfo, days: Number(e.target.value) })
                }
                className="w-full border border-[#333] text-white rounded-md px-3 py-2 text-sm outline-none bg-[#1f1f1f]"
                type="number"
                min={0}
                placeholder="Days"
              />
              <input
                onChange={(e) =>
                  setListInfo({ ...listInfo, hours: Number(e.target.value) })
                }
                className="w-full border border-[#333] text-white rounded-md px-3 py-2 text-sm outline-none bg-[#1f1f1f]"
                type="number"
                min={0}
                placeholder="Hours"
              />
            </div>
          </div>

          <Button
            disabled={loader}
            onClick={handleList}
            className={`w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 px-4 rounded transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {loader ? (
              <div className="flex items-center justify-center gap-2">
                <p>Listing NFT</p>
                <Loader className="animate-spin" color="gray" />
              </div>
            ) : (
              "List NFT"
            )}
          </Button>
        </div>

        <DialogFooter className="w-full text-sm flex justify-center items-center">
          {loader && (
            <p className="text-gray-400 text-center">
              This may take upto 1-2 minutes
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ListDialog;
