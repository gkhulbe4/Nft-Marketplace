import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AllWallets from "./AllWallets";
import { Button } from "@/components/ui/button";

function WalletPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="text-xs px-4 py-2 bg-[#141414] border border-[#333] text-gray-300 font-light cursor-pointer">
          Connect Wallet
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-4 rounded-2xl shadow-lg border border-[#333] bg-[#141414]">
        <AllWallets />
      </PopoverContent>
    </Popover>
  );
}

export default WalletPopover;
