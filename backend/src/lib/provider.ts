import { WebSocketProvider } from "ethers";
import "dotenv/config";

const provider = new WebSocketProvider(process.env.WEBSOCKET_URL!);

provider.on("error", (error) => {
  console.error("❌ WebSocket Provider Error:", error);
});

export default provider;
