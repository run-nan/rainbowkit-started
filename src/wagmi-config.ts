import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, anvil } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Hello Web3",
  projectId: "YOUR_PROJECT_ID",
  chains: [anvil, mainnet, sepolia],
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
