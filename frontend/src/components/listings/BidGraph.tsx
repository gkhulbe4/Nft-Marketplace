import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingScreen from "../LoadingScreen";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

function BidGraph({ tokenId }: { tokenId: number }) {
  const fetchNftBids = async () => {
    const res = await axios.get("http://localhost:3000/getNftBids", {
      params: { tokenId },
    });
    console.log(res.data.bids);
    return res.data.bids;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["nftBids", tokenId],
    queryFn: fetchNftBids,
    enabled: !!tokenId,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <LoadingScreen />;
  if (isError) return <div>Failed to load Bid History</div>;

  if (!data) return <div>No bids till now</div>;

  const chartData = data?.map(
    (bid: {
      amount: string;
      timestamp: string;
      bidder: {
        address: string;
      };
    }) => ({
      amount: bid.amount,
      timestamp: new Date(bid.timestamp).toISOString(), // Unique key
      label: format(new Date(bid.timestamp), "dd MMM, HH:mm"), // readable
      bidder: bid.bidder?.address ?? "Unknown",
    })
  );

  return (
    <div className="w-full h-64 mt-4 bg-[#141414] rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorBid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis
            dataKey="timestamp"
            tickFormatter={(tick) => format(new Date(tick), "dd MMM")}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(value) => `${value}`}
          />

          <Tooltip
            content={({ payload }) => {
              if (!payload || !payload.length) return null;
              const bid = payload[0].payload;
              return (
                <div className="bg-[#2d2d3f] text-white p-2 rounded-md shadow">
                  <p className="text-sm font-medium">Bid: {bid.amount} ETH</p>
                  <p className="text-xs text-gray-300">Bidder: {bid.bidder}</p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(bid.timestamp), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
              );
            }}
          />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorBid)"
            dot={{
              r: 4,
              stroke: "#8884d8",
              strokeWidth: 2,
              fill: "#0f172a",
            }}
            activeDot={{
              r: 6,
              fill: "#fff",
              stroke: "#8884d8",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BidGraph;
