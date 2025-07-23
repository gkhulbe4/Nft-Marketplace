import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAccount } from "wagmi";
import Nft from "./Nft";
import LoadingScreen from "../LoadingScreen";

function UserListedNfts() {
  const { address } = useAccount();

  const fetchUserListedNFTs = async () => {
    const res = await axios.get("http://localhost:3000/getUserListedNfts", {
      params: { address },
    });
    // console.log(res.data.listedNfts);
    return res.data.listedNfts;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userListedNfts", address],
    queryFn: fetchUserListedNFTs,
    enabled: !!address,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <LoadingScreen />;
  if (isError) return <div>Failed to load NFTs</div>;
  if (!address)
    return (
      <div className="h-screen py-4 px-12 mx-12 bg-black">
        <h2 className="text-white text-xl font-bold mb-4">
          Please connect wallet ⚠️
        </h2>
      </div>
    );

  return (
    <div className="min-h-screen py-4 px-12 mx-12 bg-black">
      <h2 className="text-white text-xl font-bold mb-4">Your Listed NFTs</h2>
      {data.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map(
            (listedNfts: {
              nft: {
                id: number;
                name: string;
                description: string;
                imgUrl: string;
                tokenId: number;
              };
              active: boolean;
              deadline: string;
              transferred: boolean;
              highestBidder: string;
              currentBid: number;
            }) => (
              <Nft
                key={listedNfts.nft.id}
                id={listedNfts.nft.id}
                name={listedNfts.nft.name}
                description={listedNfts.nft.description}
                imgUrl={listedNfts.nft.imgUrl}
                tokenId={listedNfts.nft.tokenId}
                active={listedNfts?.active}
                address={address}
                deadline={listedNfts.deadline}
                transferred={listedNfts.transferred}
                highestBidder={listedNfts?.highestBidder}
                currentBid={listedNfts?.currentBid}
              />
            )
          )}
        </ul>
      )}
    </div>
  );
}

export default UserListedNfts;
