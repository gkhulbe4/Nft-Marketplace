import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Nft } from "@/lib/types";
import ListedNft from "./ListedNft";
import LoadingScreen from "../LoadingScreen";

function HotListings() {
  const fetchHotListings = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/getHotListings`
    );
    return res.data.hotListings;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hotListings"],
    queryFn: fetchHotListings,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <div className="text-red-500">Failed to load Hot Listings</div>;
  // console.log(data);

  return (
    <div className="py-4 px-12">
      <h2 className="text-2xl font-bold mb-4 text-white">Hot Listings</h2>
      {data.length === 0 ? (
        <p className="text-gray-400">No NFTs found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((nft: Nft) => (
            <ListedNft
              key={nft.id}
              id={nft.id}
              name={nft.name}
              description={nft.description}
              imgUrl={nft.imgUrl}
              tokenId={nft.tokenId}
              currentBid={nft?.auction?.currentBid}
              highestBidder={nft.auction.highestBidder}
              deadline={nft.auction.deadline}
              minimumBid={nft.auction.minimumBid}
              createdAt={nft.auction.createdAt}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default HotListings;
