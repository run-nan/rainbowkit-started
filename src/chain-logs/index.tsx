import { Flex, Statistic, Typography, Button } from "antd";
import { useCurrentBlock } from "./use-current-block";
import { UsdtTransfersBoard } from "./usdt-transfers-board";
import { useState } from "react";

export const ChainLogs = () => {
  const currentBlock = useCurrentBlock();
  const [showUsdtTransfers, setShowUsdtTransfers] = useState(false);
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
        <Flex gap={10}>
          <Button
            type="primary"
            onClick={() => setShowUsdtTransfers(!showUsdtTransfers)}
          >
            {showUsdtTransfers ? "停止监听" : "开始监听"}
          </Button>
        </Flex>
        {showUsdtTransfers && <UsdtTransfersBoard />}
      </Flex>
    </Flex>
  );
};
