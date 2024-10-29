import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, anvil } from "wagmi/chains";
import { http } from "wagmi";

export const wagmiConfig = getDefaultConfig({
  appName: "Hello Web3",
  projectId: "YOUR_PROJECT_ID",
  chains: [anvil, mainnet, sepolia],
  transports: {
    [mainnet.id]: http("https://rpc.flashbots.net"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
