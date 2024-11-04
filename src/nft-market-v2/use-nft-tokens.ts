import { useCallback, useMemo } from "react";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import { ERC721_NFT_ABI } from "../constants/erc-721-nft";
import { useMockDBData } from "../utils/use-mock-db-data";
import { waitForTransactionReceipt } from "wagmi/actions";
import { parseEventLogs } from "viem";
import { message } from "antd";
import { NFTToken } from "./types";

export const useNFTtokens = () => {
  const { writeContractAsync } = useWriteContract();
  const account = useAccount();
  const config = useConfig();
  const [tokens, setTokens] = useMockDBData<NFTToken[]>("tokens", []);
  const chainId = useChainId();

  const mintNFTToken = useCallback(
    async (nftCA: `0x${string}`) => {
      try {
        const txHash = await writeContractAsync({
          address: nftCA,
          abi: ERC721_NFT_ABI,
          functionName: "freeMint",
          args: [account.address!],
        });
        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash,
        });
        const targetLog = parseEventLogs({
          logs: receipt.logs,
          abi: ERC721_NFT_ABI,
          eventName: "ERC721NFT_Minted",
        })[0];
        setTokens((draft) => {
          draft.push({
            tokenId: targetLog.args.tokenId,
            ca: nftCA,
            chainId,
          });
        });
        message.success("Mint NFT success");
      } catch (e) {
        message.error("Mint NFT failed");
        console.error(e);
      }
    },
    [writeContractAsync, account.address, config, setTokens, chainId]
  );

  const updateNFTToken = useCallback(
    (
      nftCA: `0x${string}`,
      tokenId: bigint,
      updater: (draft: NFTToken) => void
    ) => {
      setTokens((draft) => {
        const token = draft.find(
          (item) => item.ca === nftCA && item.tokenId === tokenId
        );
        if (token) {
          updater(token);
        }
      });
    },
    [setTokens]
  );
  return {
    tokens: useMemo(
      () => tokens.filter((item) => item.chainId === chainId),
      [chainId, tokens]
    ),
    mintNFTToken,
    updateNFTToken,
  };
};
