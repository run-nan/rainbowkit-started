import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./app.module.css";
import { PermitTokenBank } from "./permit-token-bank";
import { ChainLogs } from "./chain-logs";
import { Flex } from "antd";

export function App() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <ConnectButton />
      </div>
      <main className={styles.main}>
        <Flex vertical gap={10} style={{ minWidth: "50%" }}>
          <PermitTokenBank />
          <ChainLogs />
        </Flex>
      </main>
    </div>
  );
}
