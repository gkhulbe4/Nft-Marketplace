import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { useWriteContract } from "wagmi";
import Marketplace from "../../lib/abi/Marketplace.json";
import { toast } from "sonner";
import { waitForTransactionReceipt } from "viem/actions";
import { publicClient } from "@/lib/publicClient";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";

function ClosingAuction({
  tokenId,
  currentBid,
  highestBidder,
}: {
  tokenId: number;
  currentBid: number | null;
  highestBidder: string | null;
}) {
  const { error, writeContractAsync } = useWriteContract();
  const [loader, setLoader] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  async function handleCloseAuction() {
    try {
      setLoader(true);
      const tx = await writeContractAsync({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS,
        abi: Marketplace,
        functionName: "closeAuction",
        args: [tokenId],
      });
      console.log("tx", tx);
      const receipt = await waitForTransactionReceipt(publicClient, {
        hash: tx,
      });
      if (receipt.status === "success") {
        toast.success("Auction closed successfully!");
        queryClient.invalidateQueries({ queryKey: ["userListedNfts"] });
        queryClient.invalidateQueries({ queryKey: ["userCreatedNfts"] });
        return;
      } else {
        toast.error("Error closing auction");
        console.log(error);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Error closing auction");
    } finally {
      setLoader(false);
      setDialogOpen(false);
    }
  }

  return (
    <AlertDialog open={dialogOpen}>
      <AlertDialogTrigger asChild>
        <button
          onClick={() => setDialogOpen(true)}
          className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 font-semibold transition w-full cursor-pointer"
        >
          Close Auction
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#141414] border border-[#333] text-white w-full max-w-3xl outline-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">Close Auction</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-400 mt-2 space-y-2">
            <p>
              The final bid was{" "}
              {currentBid ? (
                <>
                  <span className="text-green-400 font-semibold">
                    {currentBid}
                  </span>{" "}
                  <span className="text-gray-300 font-semibold">ETH</span>
                </>
              ) : (
                "0 ETH"
              )}
            </p>
            <p>
              {highestBidder ? (
                <>
                  The NFT was won by{" "}
                  <span className="text-white break-all">{highestBidder}</span>.
                </>
              ) : (
                "No one placed a bid for this NFT."
              )}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => setDialogOpen(false)}
            disabled={loader}
            className="w-full border border-[#333] bg-black  cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            disabled={loader}
            onClick={handleCloseAuction}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold cursor-pointer"
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ClosingAuction;
