export const NFT_FACTORY_CA =
  "0x1A7857eCaDE917133A0CA675F8A6E2035FA69bE0" as const;
export const NFT_FACTORY_ABI = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "createERC721NFT",
    inputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "symbol", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "nftImplementation",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ERC721NFTCreated",
    inputs: [
      {
        name: "nftAddr",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "name",
        type: "string",
        indexed: true,
        internalType: "string",
      },
      {
        name: "symbol",
        type: "string",
        indexed: true,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "ERC1167FailedCreateClone", inputs: [] },
] as const;
