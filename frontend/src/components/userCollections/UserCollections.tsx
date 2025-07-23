import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CurrentBiddings from "../CurrentBiddings";
import UserNfts from "./UserNfts";
import { useAccount } from "wagmi";
import NoWallet from "../NoWallet";

function UserCollections() {
  const { address } = useAccount();
  if (address === undefined) {
    return <NoWallet />;
  }
  return (
    <div className="bg-black w-full min-h-screen py-8 px-4 flex justify-center">
      <Tabs defaultValue="user-nfts" className="w-full max-w-screen">
        <TabsList className="grid grid-cols-2 gap-4 bg-black rounded-lg border border-none shadow-md overflow-hidden w-full h-max">
          <TabsTrigger
            value="user-nfts"
            className="py-2 bg-[#141414] text-white data-[state=active]:bg-[#f8c347] data-[state=active]:text-black transition-all duration-300 border-[#333] cursor-pointer font-semibold"
          >
            Your NFTs
          </TabsTrigger>
          <TabsTrigger
            value="current-biddings"
            className="py-2 bg-[#141414] text-white data-[state=active]:bg-[#f8c347] data-[state=active]:text-black transition-all duration-300 border-[#333] cursor-pointer font-semibold"
          >
            Current Biddings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-nfts" className="mt-6">
          {/* <UserNfts /> */}
          <UserNfts />
        </TabsContent>

        <TabsContent value="current-biddings" className="mt-6">
          <CurrentBiddings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UserCollections;
