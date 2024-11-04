import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./app.module.css";
import { PermitTokenBank } from "./permit-token-bank";
import { ChainLogs } from "./chain-logs";
import { Flex } from "antd";
import { NFTMarketV2 } from "./nft-market-v2";

export function App() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <ConnectButton />
      </div>
      <main className={styles.main}>
        <Flex vertical gap={10} style={{ width: "50%" }}>
          <PermitTokenBank />
          <ChainLogs />
          <NFTMarketV2 />
        </Flex>
      </main>
    </div>
  );
}
