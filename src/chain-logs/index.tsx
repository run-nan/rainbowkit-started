import { Flex, Statistic, Typography } from "antd";
import { useCurrentBlock } from "./use-current-block";
import { useWatchUsdtTransfers } from "./use-watch-usdt-transfers";

export const ChainLogs = () => {
  const currentBlock = useCurrentBlock();

  useWatchUsdtTransfers();

  return (
    <Flex vertical gap={10}>
      <Typography.Title level={3}>Chain Logs</Typography.Title>
      <Flex vertical gap={10}>
        <Statistic
          title="block height"
          loading={currentBlock.isLoading}
          value={currentBlock.blockNumber}
        />
        <Statistic
          title="block hash"
          loading={currentBlock.isLoading}
          value={currentBlock.blockHash}
        />
        <Statistic
          title="USDT转账记录"
          value="右侧通知栏会更新最近的3条USDT转账"
        />
      </Flex>
    </Flex>
  );
};
