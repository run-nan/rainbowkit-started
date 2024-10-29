import { useState } from "react";
import { useConfig, useSignTypedData, useWriteContract } from "wagmi";
import { useCallback } from "react";
import {
  PERMIT_TOKEN_BANK_CA,
  PERMIT_TOKEN_BANK_ABI,
} from "../constants/permit-token-bank";
import { parseSignature } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import type { Account, PermitTokenType } from "./use-read-permit-token";
import { App } from "antd";

export const usePermitDeposit = (
  account: Account,
  permitToken: PermitTokenType
) => {
  const { eip712Domain, nonce } = permitToken.state;
  const { refetch } = permitToken;
  const { signTypedDataAsync } = useSignTypedData();
  const { writeContractAsync } = useWriteContract();
  const [isCallingPermitDeposit, setIsCallingPermitDeposit] = useState(false);
  const isReadyToPermitDeposit =
    eip712Domain?.status === "success" &&
    nonce?.status === "success" &&
    account.isConnected;
  const config = useConfig();
  const { message } = App.useApp();
  const permitDeposit = useCallback(async () => {
    if (!eip712Domain?.result || nonce?.status !== "success") {
      throw new Error(
        "you should not call this method before finish reading PermitToken contract"
      );
    }
    setIsCallingPermitDeposit(true);
    try {
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
      const deadline = BigInt(
        Math.floor(new Date().getTime() / 1000) + ONE_DAY
      );
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
    } catch (error) {
      console.error(error);
      message.error(`ERROR: ${error?.toString()}`);
    }
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
    message,
  ]);
  return {
    isCallingPermitDeposit,
    isReadyToPermitDeposit,
    permitDeposit,
  };
};
