import { useWatchUsdtTransfers } from "./use-watch-usdt-transfers";

export const UsdtTransfersBoard = () => {
  useWatchUsdtTransfers();
  return (
    <div id="usdt-transfers" style={{ width: "100%", height: "300px" }}></div>
  );
};
