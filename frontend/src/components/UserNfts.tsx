import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAccount } from "wagmi";
import Nft from "./Nft";
import LoadingScreen from "./LoadingScreen";

function UserNfts() {
  const { address } = useAccount();

  const fetchUserNFTs = async () => {
    const res = await axios.get("http://localhost:3000/getUserNfts", {
      params: { address },
    });
    return res.data.nfts;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userNfts", address],
    queryFn: fetchUserNFTs,
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
      {/* <h2 className="text-white text-xl font-bold mb-4">Your NFTs</h2> */}
      {data.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map(
            (nft: {
              id: number;
              name: string;
              description: string;
              imgUrl: string;
              tokenId: number;
              auction: {
                active: boolean;
              };
            }) => (
              <Nft
                key={nft.id}
                id={nft.id}
                name={nft.name}
                description={nft.description}
                imgUrl={nft.imgUrl}
                tokenId={nft.tokenId}
                active={nft?.auction?.active || false}
                address={address}
              />
            )
          )}
        </ul>
      )}
    </div>
  );
}

export default UserNfts;
