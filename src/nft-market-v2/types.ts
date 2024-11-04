export type NFTToken = {
  tokenId: bigint;
  ca: `0x${string}`;
  chainId: number;
  listingSignature?: `0x${string}`;
};
