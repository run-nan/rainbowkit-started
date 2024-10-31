import { useWatchContractEvent } from "wagmi";
import { USDT_ABI, USDT_CA } from "../constants/usdt";
import { useEffect, useRef, useState } from "react";
import Danmaku from "rc-danmaku";
import { Typography } from "antd";

export const useWatchUsdtTransfers = () => {
  const danmakuInsRef = useRef<Danmaku | null>(null);
  useEffect(() => {
    const danmakuIns = new Danmaku("#usdt-transfers", {
      minGapWidth: 60,
    });
    danmakuInsRef.current = danmakuIns;
  }, []);
  const [hasLogs, setHasLogs] = useState(false);
  useWatchContractEvent({
    address: USDT_CA,
    abi: USDT_ABI,
    eventName: "Transfer",
    onLogs(logs) {
      if (!hasLogs) {
        setHasLogs(true);
      }
      logs.forEach((log) => {
        danmakuInsRef.current?.push(
          <Typography.Text type="success">
            {log.args.from} transfers {Number(log.args.value) / 10 ** 6} $USDT
            to {log.args.to}
          </Typography.Text>
        );
      });
    },
  });
  return {
    hasLogs,
  };
};
