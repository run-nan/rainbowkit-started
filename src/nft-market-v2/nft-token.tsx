import { NFTCard } from "@ant-design/web3";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import { memo, useCallback, useMemo } from "react";
import { App } from "antd";
import type { NFTToken as TokenDBInfo } from "./types";
import { useConfirm } from "../utils/use-confirm";
import { parseEther, parseSignature } from "viem";
import { useTokenInfo } from "./use-token-info";
import dayjs from "dayjs";
import {
  readContract,
  signTypedData,
  waitForTransactionReceipt,
} from "wagmi/actions";
import {
  NFT_MARKET_V2_ABI,
  NFT_MARKET_V2_CA,
} from "../constants/nft-market-v2";
import { ERC721_NFT_ABI } from "../constants/erc-721-nft";

type Props = {
  tokenId: bigint;
  address: `0x${string}`;
  listingSignature?: `0x${string}`;
  updateNFTToken: (
    nftCA: `0x${string}`,
    tokenId: bigint,
    updater: (draft: TokenDBInfo) => void
  ) => void;
};

const DEADLINE = BigInt(dayjs("2199-04-04T16:00:00.000Z").unix());

export const NFTToken = memo(
  ({ tokenId, address, listingSignature, updateNFTToken }: Props) => {
    const { name, symbol, isLoading, owner } = useTokenInfo(address, tokenId);
    const account = useAccount();
    const { message } = App.useApp();
    const showAction = !isLoading && account.isConnected;
    const actionText = useMemo(() => {
      if (owner === account.address) {
        return listingSignature ? ("Cancel list" as const) : ("List" as const);
      }
      return listingSignature ? ("Buy" as const) : ("Make Offer" as const);
    }, [owner, account.address, listingSignature]);
    const confirm = useConfirm();
    const config = useConfig();
    const chainId = useChainId();
    const { writeContractAsync } = useWriteContract();

    const onActionClick = useCallback(async () => {
      if (actionText === "Cancel list" || actionText === "Make Offer") {
        message.warning("功能未实现");
      }
      if (actionText === "List") {
        const yes = await confirm(
          "你将以固定价格0.001 ether挂单此NFT, 挂单有效期为2199-04-04T16:00:00.000Z"
        );
        if (yes) {
          const isAuthorized = await readContract(config, {
            abi: ERC721_NFT_ABI,
            address,
            functionName: "isAuthorized",
            args: [account.address!, NFT_MARKET_V2_CA, tokenId],
          });
          if (!isAuthorized) {
            const appoveTxHash = await writeContractAsync({
              abi: ERC721_NFT_ABI,
              address,
              functionName: "setApprovalForAll",
              args: [NFT_MARKET_V2_CA, true],
            });
            await waitForTransactionReceipt(config, {
              hash: appoveTxHash,
            });
          }
          const nonce = await readContract(config, {
            abi: NFT_MARKET_V2_ABI,
            address: NFT_MARKET_V2_CA,
            functionName: "getNonces",
            args: [address, tokenId],
          });
          const domain = {
            name: "NFTMarketV2",
            version: "1",
            chainId,
            verifyingContract: NFT_MARKET_V2_CA,
          } as const;
          const types = {
            ListingOrder: [
              { name: "nftAddr", type: "address" },
              { name: "tokenID", type: "uint256" },
              { name: "price", type: "uint256" },
              { name: "listDeadline", type: "uint256" },
              { name: "nonce", type: "uint256" },
            ],
          } as const;
          const signature = await signTypedData(config, {
            domain,
            types,
            primaryType: "ListingOrder",
            message: {
              nftAddr: address,
              tokenID: tokenId,
              price: parseEther("0.001"),
              listDeadline: DEADLINE,
              nonce,
            },
          });
          updateNFTToken(address, tokenId, (draft) => {
            draft.listingSignature = signature;
          });
          message.success("挂单成功");
        }
      }
      if (actionText === "Buy") {
        const { v, r, s } = parseSignature(listingSignature!);
        const txHash = await writeContractAsync({
          abi: NFT_MARKET_V2_ABI,
          address: NFT_MARKET_V2_CA,
          functionName: "buyNFT",
          args: [
            {
              nftAddr: address,
              tokenID: tokenId,
              price: parseEther("0.001"),
              listDeadline: DEADLINE,
            },
            {
              v: Number(v),
              r,
              s,
            },
          ],
          value: parseEther("0.001"),
        });
        await waitForTransactionReceipt(config, {
          hash: txHash,
        });
        updateNFTToken(address, tokenId, (draft) => {
          draft.listingSignature = undefined;
        });
        message.success("购买成功");
      }
    }, [
      actionText,
      message,
      confirm,
      config,
      address,
      account.address,
      tokenId,
      chainId,
      updateNFTToken,
      writeContractAsync,
      listingSignature,
    ]);

    return (
      <NFTCard
        tokenId={tokenId}
        description={symbol}
        showAction={showAction}
        actionText={actionText}
        onActionClick={onActionClick}
        name={name}
        image="https://api.our-metaverse.xyz/ourms/6_pnghash_0cecc6d080015b34f60bdd253081f36e277ce20ceaf7a6340de3b06d2defad6a_26958469.webp"
      />
    );
  }
);
