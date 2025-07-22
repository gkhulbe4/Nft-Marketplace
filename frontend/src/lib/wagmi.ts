import { createConfig, http, injected } from "@wagmi/core";
import { sepolia } from "@wagmi/core/chains";

declare module "wagmi" {
  interface Register {
    config: typeof wagmi;
  }
}

export const wagmi = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    // [mainnet.id]: http(),
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
  },
});
export default wagmi;
