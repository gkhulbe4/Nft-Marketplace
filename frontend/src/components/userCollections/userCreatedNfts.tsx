import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAccount } from "wagmi";
import Nft from "./Nft";
import LoadingScreen from "../LoadingScreen";

function UserCreatedNfts() {
  const { address } = useAccount();

  const fetchUserCreatedNFTs = async () => {
    const res = await axios.get("http://localhost:3000/getUserCreatedNfts", {
      params: { address },
    });
    // console.log(res.data.createdNfts);
    return res.data.createdNfts;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userCreatedNfts", address],
    queryFn: fetchUserCreatedNFTs,
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
    <div className="h-max py-4 px-12 mx-12 bg-black">
      <h2 className="text-white text-xl font-bold mb-4">Your NFTs</h2>
      {data.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map(
            (createdNfts: {
              id: number;
              name: string;
              description: string;
              imgUrl: string;
              tokenId: number;
              active: boolean;
              deadline: string;
              transferred: boolean;
            }) => (
              <Nft
                key={createdNfts.id}
                id={createdNfts.id}
                name={createdNfts.name}
                description={createdNfts.description}
                imgUrl={createdNfts.imgUrl}
                tokenId={createdNfts.tokenId}
                active={createdNfts?.active || false}
                address={address}
                deadline={createdNfts?.deadline || ""}
                transferred={createdNfts?.transferred || false}
                highestBidder={null}
                currentBid={null}
              />
            )
          )}
        </ul>
      )}
    </div>
  );
}

export default UserCreatedNfts;
