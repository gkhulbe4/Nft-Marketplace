import { useAccount } from "wagmi";
import HotListings from "./listings/HotListings";
import RecentListings from "./listings/RecentListings";
import NoWallet from "./NoWallet";

function Listings() {
  const { address } = useAccount();
  if (address === undefined) {
    return <NoWallet />;
  }
  return (
    <div className="bg-black">
      <HotListings />
      <hr className="my-4 mx-6 text-[#333]" />
      <RecentListings />
    </div>
  );
}

export default Listings;
