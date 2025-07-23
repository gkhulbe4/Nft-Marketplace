import { Drawer, DrawerContent } from "@/components/ui/drawer";
import BidDialog from "../dialogs/BidDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import BidGraph from "./BidGraph";
import { BookText, DollarSign, LayoutPanelTop } from "lucide-react";
import getTimeRemaining from "@/lib/getTimeRemaining";

function BidDrawer({
  bidDrawerOpen,
  setBidDrawerOpen,
  name,
  description,
  imgUrl,
  tokenId,
  currentBid,
  highestBidder,
  minimumBid,

  deadline,
}: {
  bidDrawerOpen: boolean;
  setBidDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  description: string;
  imgUrl: string;
  tokenId: number;
  currentBid: number | null;
  highestBidder: string | null;
  minimumBid: number;
  createdAt: string;
  deadline: string;
}) {
  return (
    <Drawer open={bidDrawerOpen} onOpenChange={setBidDrawerOpen}>
      <DrawerContent className="bg-[#141414] text-white max-h-[90vh] h-[90vh] overflow-hidden shadow-lg border border-[#333]">
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="relative w-full md:w-1/2 flex items-center justify-center p-4 max-h-[90vh] bg-[#141414] border border-[#333] overflow-hidden">
            <img
              src={imgUrl}
              alt={name}
              className="rounded-2xl object-contain max-h-[60vh] w-full shadow-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 rounded-xl pointer-events-none" />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-start gap-6 p-6 overflow-y-auto max-h-[90vh] bg-[black]">
            <div>
              <h1 className="text-3xl font-semibold ">
                {name} <span className="text-[#f8c347]">#{tokenId}</span>
              </h1>
              <p className="text-sm text-gray-400 line-clamp-2 font-light">
                Owned by{" "}
                <span className="text-white">
                  0x5aE1fbD995B32D2e4C4733D36A45b346E3dABb2E
                </span>
              </p>

              <div className="flex gap-3 mt-3">
                <p className="text-[10px] border border-[#333] px-2 py-1 rounded-md">
                  ERC721
                </p>
                <p className="text-[10px] border border-[#333] px-2 py-1 rounded-md">
                  ETHEREUM
                </p>
                <p className="text-[10px] border border-[#333] px-2 py-1 rounded-md">
                  TOKEN #{tokenId}
                </p>
              </div>

              <div className="mt-4 px-5 py-4 bg-[#141414] rounded-lg">
                <div className="flex justify-between border-b border-gray-600 pb-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <p className="text-sm text-gray-400 font-extralight">
                      STARTING BID
                    </p>
                    {minimumBid} ETH
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <p className="text-sm text-gray-400 font-extralight">
                      HIGHEST BIDDER
                    </p>
                    {highestBidder ? highestBidder : "N/A"}
                  </div>
                </div>

                <div>
                  <div>
                    <p className="text-sm text-gray-400 font-extralight">
                      CURRENT BID
                    </p>
                    <div className="flex gap-4 items-end">
                      <p className="text-3xl">
                        {currentBid ? `${currentBid} ETH` : "N/A"}
                      </p>
                      <p className="text-[10px] border border-gray-600 px-2 py-1 rounded-md h-max">
                        {new Date(deadline).getTime() < Date.now() ? (
                          <span className="text-red-500 font-semibold">
                            Expired
                          </span>
                        ) : (
                          <>
                            ENDING IN{" "}
                            <span className="text-[#f8c347]">
                              {getTimeRemaining(deadline)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <BidDialog
                    tokenId={tokenId}
                    minimumBid={currentBid ? currentBid : minimumBid}
                    deadline={deadline}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-2">
              <Accordion className="space-y-3" type="single" collapsible>
                <AccordionItem
                  value="bid-history"
                  className="border border-[#333] rounded-lg bg-[#141414]"
                >
                  <AccordionTrigger className="group flex items-center justify-between text-left  p-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400 group-hover:text-white group-data-[state=open]:text-white" />
                      <span className="text-white font-medium">
                        Bid History
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-[#141414] px-4 pb-4 pt-1">
                    <BidGraph tokenId={tokenId} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="about"
                  className="border border-[#333] rounded-lg bg-[#141414]"
                >
                  <AccordionTrigger className="group flex items-center justify-between text-left p-4 hover:no-underline data-[state=open]:text-white">
                    <div className="flex items-center gap-2">
                      <BookText className="h-4 w-4 text-gray-400 group-hover:text-white group-data-[state=open]:text-white" />
                      <span className="text-white font-medium">About</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-[#141414] px-4 pb-4 pt-1">
                    <div className="text-sm text-gray-400">{description}</div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="blockchain-details"
                  className="border border-[#333] rounded-lg bg-[#141414]"
                >
                  <AccordionTrigger className="group flex items-center justify-between text-left  p-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <LayoutPanelTop className="h-4 w-4 text-gray-400 group-hover:text-white group-data-[state=open]:text-white" />
                      <span className="text-white font-medium">
                        Blockchain Details{" "}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-[#141414] px-4 pb-4 pt-1 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <p className="text-gray-400">Contract Address</p>
                      <a
                        href={`https://sepolia.etherscan.io/token/${
                          import.meta.env.VITE_CUSTOM_NFT_ADDRESS
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400"
                      >
                        0xeE048d0AD241Bd104D31dea1a0AdFBea51439Ccf
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Token ID</p>
                      <p className="font-light">{tokenId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Token Standard</p>
                      <p className="font-light">ERC721</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Chain</p>
                      <p className="font-light">Sepolia Ethereum</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default BidDrawer;
