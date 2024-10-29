import { useAccount, useReadContracts } from "wagmi";
import { PERMIT_TOKEN_ABI, PERMIT_TOKEN_CA } from "../constants/permit-token";
import { PERMIT2_CA } from "../constants/permit2";

export type Account = ReturnType<typeof useAccount>;

export type PermitTokenType = ReturnType<typeof useReadPermitToken>;

export const useReadPermitToken = (account: Account) => {
  const permitTokenContractInfo = {
    address: PERMIT_TOKEN_CA,
    abi: PERMIT_TOKEN_ABI,
  } as const;
  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        ...permitTokenContractInfo,
        functionName: "balanceOf",
        args: [account.address as `0x${string}`],
      } as const,
      {
        ...permitTokenContractInfo,
        functionName: "eip712Domain",
      } as const,
      {
        ...permitTokenContractInfo,
        functionName: "nonces",
        args: [account.address as `0x${string}`],
      } as const,
      {
        ...permitTokenContractInfo,
        functionName: "allowance",
        args: [account.address as `0x${string}`, PERMIT2_CA],
      },
    ] as const,
  });
  const [balance, eip712Domain, nonce, allowanceToPermit2] = data || [];
  return {
    state: {
      balance,
      eip712Domain,
      nonce,
      allowanceToPermit2,
    },
    isLoading,
    refetch,
  };
};
