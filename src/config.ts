import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, anvil } from "wagmi/chains";
import { http } from "wagmi";

export const wagmiConfig = getDefaultConfig({
  appName: "Hello Web3",
  projectId: "YOUR_PROJECT_ID",
  chains: [anvil, mainnet, sepolia],
  transports: {
    [mainnet.id]: http("https://rpc.flashbots.net"),
    [sepolia.id]: http("https://rpc2.sepolia.org"),
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
