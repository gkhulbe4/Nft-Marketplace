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
import { toast } from "sonner";
import { waitForTransactionReceipt } from "viem/actions";
import { publicClient } from "@/lib/publicClient";
import { queryClient } from "@/lib/queryClient";
import { Loader } from "lucide-react";

function BidDialog({
  tokenId,
  minimumBid,
  deadline,
}: {
  tokenId: number;
  minimumBid: string | null;
  deadline: string;
}) {
  const [bidAmount, setBidAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { error, writeContractAsync } = useWriteContract();

  async function handleBid() {
    if (bidAmount <= 0) {
      toast.info("Please enter a valid bid amount");
      return;
    }
    if (bidAmount <= parseFloat(minimumBid!)) {
      toast.info(`Bid amount must be greater than ${minimumBid} ETH`);
      return;
    }
    try {
      setLoader(true);
      const tx = await writeContractAsync({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS,
        abi: Marketplace,
        functionName: "placeBid",
        args: [tokenId],
        value: BigInt(bidAmount * 1e18),
      });
      const receipt = await waitForTransactionReceipt(publicClient, {
        hash: tx,
      });
      console.log("✅ Transaction confirmed:", receipt);
      if (receipt.status === "success") {
        toast.success("Bid placed successfully!");
        queryClient.invalidateQueries({ queryKey: ["hotListings"] });
        queryClient.invalidateQueries({ queryKey: ["recentListings"] });
        return;
      } else {
        toast.error("NFT Bidding failed!");
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
          disabled={new Date(deadline).getTime() < Date.now()}
          className="w-full mt-2 font-semibold text-sm py-2 px-4 rounded bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {new Date(deadline).getTime() < Date.now()
            ? "Deadline Passed"
            : "Place Bid"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#141414] border border-[#333] rounded-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#f8c347]">
            Place a Bid
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-300 font-light">
            Enter your bid amount in ETH to participate in the auction.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#f8c347] mb-1">
              Bid Amount (ETH)
            </label>
            <input
              onChange={(e) => setBidAmount(Number(e.target.value))}
              className="w-full bg-[#1f1f1f] border text-white placeholder-gray-500 rounded-md px-3 py-2 text-sm outline-none border-[#333]"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.01"
            />
          </div>

          <Button
            disabled={loader}
            onClick={handleBid}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loader ? (
              <div className="flex items-center justify-center gap-2">
                <p>Submitting Bid</p>
                <Loader className="animate-spin" color="gray" />
              </div>
            ) : (
              "Submit Bid"
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

export default BidDialog;
