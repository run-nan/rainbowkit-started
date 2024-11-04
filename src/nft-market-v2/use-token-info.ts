import { useReadContracts } from "wagmi";
import { ERC721_NFT_ABI } from "../constants/erc-721-nft";
import { useNFTtokens } from "./use-nft-tokens";
import { useMemo } from "react";

export const useTokenInfo = (address: `0x${string}`, tokenId: bigint) => {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { address, abi: ERC721_NFT_ABI, functionName: "name" },
      { address, abi: ERC721_NFT_ABI, functionName: "symbol" },
      {
        address,
        abi: ERC721_NFT_ABI,
        functionName: "ownerOf",
        args: [tokenId],
      },
    ],
  });
  const { tokens } = useNFTtokens();
  const tokenDBInfo = useMemo(
    () => tokens.find((item) => item.tokenId === tokenId),
    [tokens, tokenId]
  );
  const [name, symbol, owner] = data ?? [];
  return {
    name: name?.result || "",
    symbol: symbol?.result || "",
    owner: owner?.result || "",
    listingSignature: tokenDBInfo?.listingSignature,
    isLoading,
  };
};
