import { useWatchContractEvent } from "wagmi";
import { USDT_ABI, USDT_CA } from "../constants/usdt";
import { useEffect, useRef } from "react";
import Danmaku from "rc-danmaku";
import { Tag } from "antd";

// eslint-disable-next-line react-refresh/only-export-components
const COLORS = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
] as const;

const wait = (ms: number) => {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      resolve();
      clearTimeout(timer);
    }, ms);
  });
};

export const useWatchUsdtTransfers = () => {
  const danmakuInsRef = useRef<Danmaku | null>(null);
  useEffect(() => {
    const danmakuIns = new Danmaku("#usdt-transfers", {
      minGapWidth: 60,
    });
    danmakuInsRef.current = danmakuIns;
    return () => {
      danmakuInsRef.current?.clearQueue();
      danmakuInsRef.current?.destroy();
    };
  }, []);
  useWatchContractEvent({
    address: USDT_CA,
    abi: USDT_ABI,
    eventName: "Transfer",
    async onLogs(logs) {
      for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        danmakuInsRef.current?.push(
          <Tag color={COLORS[i % COLORS.length]}>
            {log.args.from} transfers {Number(log.args.value) / 10 ** 6} $USDT
            to
            {log.args.to}
          </Tag>
        );
        await wait(500);
      }
    },
  });
};
