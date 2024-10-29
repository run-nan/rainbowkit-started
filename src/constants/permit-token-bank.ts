export const PERMIT_TOKEN_BANK_CA =
  "0x86D8fd812e3f294C1d52860CD08F5116DA9B4A8F" as const;
export const PERMIT_TOKEN_BANK_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract PermitToken",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deposits",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "permit2Deposit",
    inputs: [
      {
        name: "permitDetail",
        type: "tuple",
        internalType: "struct PermitTokenBank.PermitDetail",
        components: [
          { name: "owner", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "permitDeposit",
    inputs: [
      { name: "depositor", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "v", type: "uint8", internalType: "uint8" },
      { name: "r", type: "bytes32", internalType: "bytes32" },
      { name: "s", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract PermitToken",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
