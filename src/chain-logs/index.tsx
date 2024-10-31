import { Flex, Statistic, Typography } from "antd";
import { useCurrentBlock } from "./use-current-block";
import { useWatchUsdtTransfers } from "./use-watch-usdt-transfers";

export const ChainLogs = () => {
  const currentBlock = useCurrentBlock();

  const { hasLogs } = useWatchUsdtTransfers();

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
        <Typography.Text type="secondary">USDT转账记录</Typography.Text>
        <div id="usdt-transfers" style={{ width: "100%", height: "300px" }}>
          {hasLogs ? null : (
            <Typography.Title level={5}>监听中</Typography.Title>
          )}
        </div>
      </Flex>
    </Flex>
  );
};
