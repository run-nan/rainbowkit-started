import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import styles from "./app.module.css";

export function App() {
  const { address, isConnected } = useAccount();
  return (
    <div className={styles.wrapper}>
      <div className={styles.footer}>
        <ConnectButton />
      </div>
      <main className={styles.main}>
        <h1>{isConnected ? `Hello ${address}` : `Please Connect`}</h1>
      </main>
    </div>
  );
}
