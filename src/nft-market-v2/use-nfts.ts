import { NFT_FACTORY_ABI, NFT_FACTORY_CA } from "../constants/nft-factory";
import { useWriteContract, useConfig, useChainId } from "wagmi";
import { useCallback, useMemo, useState } from "react";
import { App } from "antd";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useMockDBData } from "../utils/use-mock-db-data";
import { parseEventLogs } from "viem";

type DeployedNFT = {
  ca: `0x${string}`;
  name: string;
  symbol: string;
  chainId: number;
};

export const useNFTs = () => {
  const { message } = App.useApp();
  const [isDeploying, setIsDeploying] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const [deployedNFTs, setDeployedNFTs] = useMockDBData<DeployedNFT[]>(
    "deployedNFTs",
    []
  );

  const chainId = useChainId();

  const deployNFT = useCallback(async () => {
    setIsDeploying(true);
    try {
      const txHash = await writeContractAsync({
        address: NFT_FACTORY_CA,
        abi: NFT_FACTORY_ABI,
        functionName: "createERC721NFT",
        args: [name, symbol],
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash!,
      });
      const targetLog = parseEventLogs({
        logs: receipt.logs,
        abi: NFT_FACTORY_ABI,
        eventName: "ERC721NFTCreated",
      })[0];
      setDeployedNFTs((draft) => {
        draft.push({
          ca: targetLog.args.nftAddr!,
          name,
          symbol,
          chainId,
        });
      });
    } catch (e) {
      message.error("部署失败");
      console.error(e);
    }
    setName("");
    setSymbol("");
    setIsDeploying(false);
  }, [
    writeContractAsync,
    name,
    symbol,
    config,
    setDeployedNFTs,
    message,
    chainId,
  ]);

  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);
  const onSymbolChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSymbol(e.target.value);
    },
    []
  );

  return {
    isDeploying,
    name,
    symbol,
    onNameChange,
    onSymbolChange,
    deployNFT,
    deployedNFTs: useMemo(
      () => deployedNFTs.filter((nft) => nft.chainId === chainId),
      [deployedNFTs, chainId]
    ),
  };
};
