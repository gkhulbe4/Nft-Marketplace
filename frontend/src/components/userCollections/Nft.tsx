import ClosingAuction from "../dialogs/ClosingAuction";
import ListDialog from "../dialogs/ListDialog";

function Nft({
  id,
  name,
  // description,
  imgUrl,
  tokenId,
  active,
  address,
  deadline,
  // transferred,
  highestBidder,
  currentBid,
}: {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  tokenId: number;
  active: boolean;
  address: string;
  deadline: string;
  transferred: boolean;
  highestBidder: string | null;
  currentBid: number | null;
}) {
  const shortenAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "N/A";
  };
  return (
    <li
      key={id}
      className="relative group bg-[#141414] rounded-xl shadow-md border border-[#333] w-72 h-fit flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-300 hover:scale-102"
    >
      {new Date(deadline).getTime() < Date.now() && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded-md z-20 shadow-md font-bold">
          Expired
        </div>
      )}
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

        {active && (
          <div className="text-xs space-y-1">
            <p className="text-gray-400">
              <span className="font-light text-gray-400">
                {" "}
                {new Date(deadline).getTime() < Date.now()
                  ? "FINAL BID:"
                  : "CURRENT BID:"}
              </span>{" "}
              {currentBid ? (
                <>
                  <span className="text-green-400 font-semibold">
                    {currentBid}
                  </span>{" "}
                  <span className="text-gray-300 font-semibold">ETH</span>
                </>
              ) : (
                "No bids yet"
              )}
            </p>
            <p className="text-gray-200">
              <span className="font-light text-gray-400">
                {new Date(deadline).getTime() < Date.now()
                  ? "WINNER:"
                  : "HIGHEST BIDDER:"}
              </span>{" "}
              {highestBidder ? shortenAddress(highestBidder) : "N/A"}
            </p>
          </div>
        )}
      </div>

      <>
        {new Date(deadline).getTime() < Date.now() ? (
          <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-blue-600 text-white text-sm font-semibold flex items-center justify-center rounded-b-xl z-10">
            <ClosingAuction
              tokenId={tokenId}
              currentBid={currentBid}
              highestBidder={highestBidder}
            />
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-blue-600 text-white text-sm font-semibold flex items-center justify-center rounded-b-xl z-10">
            <ListDialog
              tokenId={tokenId}
              active={active}
              address={address}
              deadline={deadline}
            />
          </div>
        )}
      </>
      <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-blue-600 text-white text-sm font-semibold flex items-center justify-center rounded-b-xl z-10"></div>
    </li>
  );
}

export default Nft;
