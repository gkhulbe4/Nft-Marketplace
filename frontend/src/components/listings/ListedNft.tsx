import { useState } from "react";
import BidDrawer from "./BidDrawer";

function ListedNft({
  id,
  name,
  description,
  imgUrl,
  tokenId,
  currentBid,
  highestBidder,
  deadline,
  minimumBid,
  createdAt,
}: {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  tokenId: number;
  currentBid: string | null;
  highestBidder: string | null;
  deadline: string;
  minimumBid: string;
  createdAt: string;
}) {
  const [bidDrawerOpen, setBidDrawerOpen] = useState(false);

  return (
    <>
      <li
        key={id}
        onClick={() => setBidDrawerOpen(true)}
        className="relative group bg-[#141414] rounded-xl shadow-md border border-[#333] w-72 h-fit flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 hover:scale-102"
      >
        <img
          src={imgUrl}
          alt={name}
          className="h-52 w-full object-fill rounded-lg mb-3"
        />

        <div className="space-y-1 text-sm group-hover:opacity-40 transition-opacity duration-300 z-0 p-4">
          <p className="text-sm text-white font-medium truncate">
            {name}{" "}
            <span className="text-[#f8c347] text-md font-semibold">
              #{tokenId}
            </span>
          </p>

          <p className="text-gray-400 text-xs">
            <span>{currentBid == null ? "STARTING BID:" : "CURRENT BID:"}</span>{" "}
            <span className="text-green-400 font-semibold">
              {currentBid ?? minimumBid}
            </span>{" "}
            <span className="text-gray-300 font-semibold">ETH</span>
          </p>
        </div>

        <div
          className={`absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out py-3 px-4 text-white text-sm font-semibold flex items-center justify-center rounded-b-xl z-10 ${
            new Date(deadline).getTime() < Date.now()
              ? "bg-gray-600"
              : "bg-purple-600"
          }`}
        >
          {new Date(deadline).getTime() < Date.now()
            ? "Deadline Passed"
            : "Place Bid"}
        </div>
      </li>

      <BidDrawer
        bidDrawerOpen={bidDrawerOpen}
        setBidDrawerOpen={setBidDrawerOpen}
        name={name}
        description={description}
        imgUrl={imgUrl}
        tokenId={tokenId}
        currentBid={currentBid}
        highestBidder={highestBidder}
        minimumBid={minimumBid}
        createdAt={createdAt}
        deadline={deadline}
      />
    </>
  );
}

export default ListedNft;
