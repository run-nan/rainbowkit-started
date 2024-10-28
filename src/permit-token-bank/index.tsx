import { Flex, Button, Typography } from "antd";
import { useState } from "react";
import {
  useAccount,
  useConfig,
  useReadContracts,
  useSignTypedData,
  useWriteContract,
} from "wagmi";
import { PERMIT_TOKEN_ABI, PERMIT_TOKEN_CA } from "../abi/permit-token.abi";
import { useCallback } from "react";
import {
  PERMIT_TOKEN_BANK_CA,
  PERMIT_TOKEN_BANK_ABI,
} from "../abi/permit-token-bank.abi";
import { parseSignature } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";

type Account = ReturnType<typeof useAccount>;

const useReadPermitToken = (account: Account) => {
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
    ] as const,
  });
  const [balance, eip712Domain, nonce] = data || [];
  return {
    state: {
      balance,
      eip712Domain,
      nonce,
    },
    isLoading,
    refetch,
  };
};

type PermitTokenType = ReturnType<typeof useReadPermitToken>;

const useMintPermitToken = (account: Account, permitToken: PermitTokenType) => {
  const { writeContractAsync } = useWriteContract();
  const [isMinting, setIsMinting] = useState(false);
  const { refetch } = permitToken;
  const config = useConfig();
  const mintPermitToken = useCallback(async () => {
    setIsMinting(true);
    const txHash = await writeContractAsync({
      address: PERMIT_TOKEN_CA,
      abi: PERMIT_TOKEN_ABI,
      functionName: "mint",
      args: [account.address as `0x${string}`, 100n * 10n ** 2n],
    });
    await waitForTransactionReceipt(config, {
      hash: txHash!,
    });
    refetch();
    setIsMinting(false);
  }, [writeContractAsync, account.address, refetch, config]);
  return {
    mintPermitToken,
    isMinting,
  };
};

const usePermitDeposit = (account: Account, permitToken: PermitTokenType) => {
  const { eip712Domain, nonce } = permitToken.state;
  const { refetch } = permitToken;
  const { signTypedDataAsync } = useSignTypedData();
  const { writeContractAsync } = useWriteContract();
  const [isCallingPermitDeposit, setIsCallingPermitDeposit] = useState(false);
  const isReadyToPermitDeposit =
    eip712Domain?.status === "success" && nonce?.status === "success";
  const config = useConfig();
  const permitDeposit = useCallback(async () => {
    if (!eip712Domain?.result || nonce?.status !== "success") {
      throw new Error(
        "you should not call this method before finish reading PermitToken contract"
      );
    }
    setIsCallingPermitDeposit(true);
    const [, name, version, chainId, verifyingContract] = eip712Domain.result;
    const domain = {
      name,
      version,
      verifyingContract,
      chainId: Number(chainId),
    } as const;
    const types = {
      Permit: [
        {
          name: "owner",
          type: "address",
        },
        {
          name: "spender",
          type: "address",
        },
        {
          name: "value",
          type: "uint256",
        },
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "deadline",
          type: "uint256",
        },
      ],
    } as const;
    const ONE_DAY = 24 * 60 * 60;
    const owner = account.address as `0x${string}`;
    const spender = PERMIT_TOKEN_BANK_CA;
    const value = BigInt(100 * 10 ** 2);
    const deadline = BigInt(Math.floor(new Date().getTime() / 1000) + ONE_DAY);
    const signature = await signTypedDataAsync({
      domain,
      types,
      primaryType: "Permit",
      message: {
        owner,
        spender,
        value,
        nonce: nonce.result,
        deadline,
      },
    });
    const { r, s, v } = parseSignature(signature);
    const txHash = await writeContractAsync({
      address: PERMIT_TOKEN_BANK_CA,
      abi: PERMIT_TOKEN_BANK_ABI,
      functionName: "permitDeposit",
      args: [owner, value, deadline, Number(v), r, s],
    });
    const result = await waitForTransactionReceipt(config, {
      hash: txHash,
    });
    console.log(result);
    refetch();
    setIsCallingPermitDeposit(false);
  }, [
    eip712Domain,
    signTypedDataAsync,
    writeContractAsync,
    account.address,
    nonce?.result,
    nonce?.status,
    config,
    refetch,
  ]);
  return {
    isCallingPermitDeposit,
    isReadyToPermitDeposit,
    permitDeposit,
  };
};

export const PermitTokenBank = () => {
  const account = useAccount();
  const permitToken = useReadPermitToken(account);
  const { isMinting, mintPermitToken } = useMintPermitToken(
    account,
    permitToken
  );
  const { isCallingPermitDeposit, isReadyToPermitDeposit, permitDeposit } =
    usePermitDeposit(account, permitToken);
  return (
    <Flex gap={10} align="center">
      {permitToken?.state?.balance?.status === "success" && (
        <Typography.Text>
          余额: {(permitToken?.state?.balance?.result / 10n ** 2n).toString()}{" "}
          $PT
        </Typography.Text>
      )}
      <Button
        type="primary"
        disabled={!account.isConnected}
        loading={isMinting}
        onClick={mintPermitToken}
      >
        Mint 100 $PT
      </Button>
      <Button
        type="primary"
        disabled={!account.isConnected || !isReadyToPermitDeposit}
        loading={isCallingPermitDeposit}
        onClick={permitDeposit}
      >
        Permit deposit 100 $PT
      </Button>
    </Flex>
  );
};
