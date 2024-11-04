export const NFT_MARKET_V2_CA =
  "0xDf92c83a98AF7879dF808fc02D449D1a921F9e8e" as const;
export const NFT_MARKET_V2_ABI = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "LISTING_ORDER_TYPEHASH",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "buyNFT",
    inputs: [
      {
        name: "order",
        type: "tuple",
        internalType: "struct NFTMarketV2.ListingOrderInfo",
        components: [
          { name: "nftAddr", type: "address", internalType: "address" },
          { name: "tokenID", type: "uint256", internalType: "uint256" },
          { name: "price", type: "uint256", internalType: "uint256" },
          {
            name: "listDeadline",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      {
        name: "sig",
        type: "tuple",
        internalType: "struct NFTMarketV2.Signature",
        components: [
          { name: "v", type: "uint8", internalType: "uint8" },
          { name: "r", type: "bytes32", internalType: "bytes32" },
          { name: "s", type: "bytes32", internalType: "bytes32" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "eip712Domain",
    inputs: [],
    outputs: [
      { name: "fields", type: "bytes1", internalType: "bytes1" },
      { name: "name", type: "string", internalType: "string" },
      { name: "version", type: "string", internalType: "string" },
      { name: "chainId", type: "uint256", internalType: "uint256" },
      {
        name: "verifyingContract",
        type: "address",
        internalType: "address",
      },
      { name: "salt", type: "bytes32", internalType: "bytes32" },
      {
        name: "extensions",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNonces",
    inputs: [
      { name: "nftAddr", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nonces",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "EIP712DomainChanged",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "NFTMarketV2_Sold",
    inputs: [
      {
        name: "nftAddr",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenID",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "seller",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "buyer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "price",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "ECDSAInvalidSignature", inputs: [] },
  {
    type: "error",
    name: "ECDSAInvalidSignatureLength",
    inputs: [{ name: "length", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "ECDSAInvalidSignatureS",
    inputs: [{ name: "s", type: "bytes32", internalType: "bytes32" }],
  },
  {
    type: "error",
    name: "InvalidAccountNonce",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
      { name: "currentNonce", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "InvalidShortString", inputs: [] },
  {
    type: "error",
    name: "NFTMarketV2_InsufficientPayment",
    inputs: [
      { name: "price", type: "uint256", internalType: "uint256" },
      { name: "payment", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "NFTMarketV2_InvalidSigner",
    inputs: [
      { name: "nftOwner", type: "address", internalType: "address" },
      { name: "signer", type: "address", internalType: "address" },
    ],
  },
  {
    type: "error",
    name: "NFTMarketV2_NotApproved",
    inputs: [
      { name: "nftAddr", type: "address", internalType: "address" },
      { name: "tokenID", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "NFTMarketV2_OrderExpired",
    inputs: [
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "timestamp", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "StringTooLong",
    inputs: [{ name: "str", type: "string", internalType: "string" }],
  },
] as const;
