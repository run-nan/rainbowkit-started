import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./app.module.css";
import { PermitTokenBank } from "./permit-token-bank";

export function App() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <ConnectButton />
      </div>
      <main className={styles.main}>
        <PermitTokenBank />
      </main>
    </div>
  );
}
