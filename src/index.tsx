import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { App } from "./app.tsx";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "./config";
import { ConfigProvider, App as AntdApp } from "antd";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <ConfigProvider>
        <AntdApp>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <App />
            </RainbowKitProvider>
          </QueryClientProvider>
        </AntdApp>
      </ConfigProvider>
    </WagmiProvider>
  </StrictMode>
);
