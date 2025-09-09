import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAccount } from "wagmi";
import Bid from "./Bid";
import LoadingScreen from "./LoadingScreen";

function CurrentBiddings() {
  const { address } = useAccount();

  const fetchCurrentBiddings = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/getCurrentBiddings`,
      {
        params: { address },
      }
    );
    // console.log(res.data.bids);
    return res.data.bids;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentBiddings", address],
    queryFn: fetchCurrentBiddings,
    enabled: !!address,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <LoadingScreen />;

  if (!data)
    return (
      <div className="text-red-500 text-sm px-12 pt-6">
        Failed to load your current biddings.
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-sm px-12 pt-6">
        Failed to load your current biddings.
      </div>
    );

  if (data.length === 0) {
    return (
      <div className="px-12 pt-6 text-white text-sm opacity-80">
        You haven’t placed any bids yet.
      </div>
    );
  }

  return (
    <div className="px-12 pt-6 space-y-4 mx-12">
      <h2 className="text-gray-300 text-xl font-light mb-6">
        These are all the NFTs you’re currently the highest bidder on
      </h2>
      {data.map(
        (bid: {
          deadline: string;
          bids: [
            {
              id: string;
              amount: string;
              timestamp: string;
              deadline: string;
            }
          ];
          nft: {
            name: string;
            imgUrl: string;
            tokenId: number;
          };
        }) => (
          <Bid
            key={bid.bids[0].id}
            name={bid.nft.name}
            amount={bid.bids[0].amount}
            timestamp={bid.bids[0].timestamp}
            imgUrl={bid.nft.imgUrl}
            tokenId={bid.nft.tokenId}
            deadline={bid.deadline}
            createdAt={bid.bids[0].timestamp}
          />
        )
      )}
    </div>
  );
}

export default CurrentBiddings;
