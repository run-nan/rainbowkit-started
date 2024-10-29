import { useBlock, useWatchBlocks } from "wagmi";
import { useEffect, useState } from "react";

export const useCurrentBlock = () => {
  const { isLoading, data: currentBlock } = useBlock();
  const [blockNumber, setBlockNumber] = useState<number | "-">("-");
  const [blockHash, setBlockHash] = useState("-");
  useWatchBlocks({
    onBlock(block) {
      setBlockNumber(Number(block.number));
      setBlockHash(block.hash);
    },
  });
  useEffect(() => {
    if (!isLoading && currentBlock?.number && currentBlock?.hash) {
      setBlockNumber(Number(currentBlock.number));
      setBlockHash(currentBlock.hash);
    }
  }, [isLoading, currentBlock]);
  return {
    blockNumber,
    blockHash,
    isLoading,
  };
};
