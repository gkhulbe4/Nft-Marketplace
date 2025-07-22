import HotListings from "./listings/HotListings";
import RecentListings from "./listings/RecentListings";

function Listings() {
  return (
    <div className="bg-black">
      <HotListings />
      <hr className="my-4 mx-6 text-[#333]" />
      <RecentListings />
    </div>
  );
}

export default Listings;
