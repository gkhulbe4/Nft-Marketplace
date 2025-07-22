import { useCountdown } from "@/hooks/useCountdown";
import { format } from "date-fns";

function Bid({
  name,
  amount,
  timestamp,
  tokenId,
  imgUrl,
  deadline,
}: {
  name: string;
  amount: string;
  timestamp: string;
  tokenId: number;
  imgUrl: string;
  deadline: string;
  createdAt: string;
}) {
  const { days, hours, minutes, seconds, total } = useCountdown(deadline);

  return (
    <div className="flex items-center gap-4 bg-[#141414] border border-[#333] rounded-xl p-4 hover:border-[#f8c347] hover:shadow-[0_0_10px_rgba(143,67,255,0.2)] transition-all duration-200">
      <img
        src={imgUrl}
        alt={name}
        className="w-16 h-16 rounded-lg object-cover border border-[#333]"
      />

      <div className="flex flex-col justify-between text-sm text-white w-full">
        <div className="flex justify-between items-center w-full">
          <span className="font-semibold truncate">{name}</span>
          <span className="text-[#A0A0B0] text-xs font-mono">
            Token #{tokenId}
          </span>
        </div>

        <div className="mt-1 flex justify-between items-center">
          <span className="text-[#00E395] font-semibold text-xs">
            {Number(amount).toFixed(4)} ETH
          </span>
          <span className="text-[#808097] text-xs">
            Placed on: {format(new Date(timestamp), "dd MMM yyyy, h:mm a")}
          </span>
        </div>

        <div className="mt-1 flex justify-end">
          {total <= 0 ? (
            <span className="text-red-400 text-xs font-medium">
              Auction ended
            </span>
          ) : (
            <span className="text-[#FFD580] text-xs font-medium">
              Ends in: {days}d {hours}h {minutes}m {seconds}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bid;
