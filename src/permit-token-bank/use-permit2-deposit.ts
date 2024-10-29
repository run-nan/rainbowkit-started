import { useCallback, useState } from "react";
import type { Account, PermitTokenType } from "./use-read-permit-token";
import {
  useChainId,
  useSignTypedData,
  useConfig,
  useWriteContract,
} from "wagmi";
import { PERMIT_TOKEN_ABI, PERMIT_TOKEN_CA } from "../constants/permit-token";
import { PERMIT2_CA } from "../constants/permit2";
import {
  PERMIT_TOKEN_BANK_ABI,
  PERMIT_TOKEN_BANK_CA,
} from "../constants/permit-token-bank";
import { waitForTransactionReceipt } from "wagmi/actions";
import { App } from "antd";

export const usePermit2Deposit = (
  account: Account,
  permitToken: PermitTokenType
) => {
  const { allowanceToPermit2 } = permitToken.state;
  const { refetch } = permitToken;
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const config = useConfig();
  const [isCallingPermit2Deposit, setIsCallingPermit2Deposit] = useState(false);
  const { signTypedDataAsync } = useSignTypedData();
  const { message } = App.useApp();

  const permit2Deposit = useCallback(async () => {
    if (allowanceToPermit2?.status !== "success") {
      throw new Error(
        "you should not call permit2Deposit before finish reading PermitToken"
      );
    }
    setIsCallingPermit2Deposit(true);
    try {
      if (allowanceToPermit2.result == 0n) {
        const MAX_UINT256 = 2n ** 256n - 1n;
        const approveTxHash = await writeContractAsync({
          address: PERMIT_TOKEN_CA,
          abi: PERMIT_TOKEN_ABI,
          functionName: "approve",
          args: [PERMIT2_CA, MAX_UINT256],
        });
        await waitForTransactionReceipt(config, {
          hash: approveTxHash,
        });
      }
      const ONE_DAY = 24 * 60 * 60;
      const deadline = BigInt(
        Math.floor(new Date().getTime() / 1000) + ONE_DAY
      );
      const amount = 100n * 10n ** 2n;
      const nonce = BigInt(Math.floor(Math.random() * 10 ** 7));
      const signature = await signTypedDataAsync({
        domain: {
          name: "Permit2",
          chainId,
          verifyingContract: PERMIT2_CA,
        } as const,
        types: {
          PermitTransferFrom: [
            {
              name: "permitted",
              type: "TokenPermissions",
            },
            {
              name: "spender",
              type: "address",
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
          TokenPermissions: [
            {
              name: "token",
              type: "address",
            },
            {
              name: "amount",
              type: "uint256",
            },
          ],
        } as const,
        primaryType: "PermitTransferFrom" as const,
        message: {
          permitted: {
            token: PERMIT_TOKEN_CA,
            amount,
          },
          spender: PERMIT_TOKEN_BANK_CA,
          nonce,
          deadline,
        },
      });
      const permit2DepositTxHash = await writeContractAsync({
        address: PERMIT_TOKEN_BANK_CA,
        abi: PERMIT_TOKEN_BANK_ABI,
        functionName: "permit2Deposit",
        args: [
          {
            owner: account.address as `0x${string}`,
            amount,
            deadline,
            nonce,
          },
          signature,
        ],
      });
      await waitForTransactionReceipt(config, {
        hash: permit2DepositTxHash,
      });
      refetch();
    } catch (error) {
      console.error(error);
      message.error(`ERROR: ${error?.toString()}`);
    }
    setIsCallingPermit2Deposit(false);
  }, [
    allowanceToPermit2?.status,
    allowanceToPermit2?.result,
    writeContractAsync,
    account.address,
    chainId,
    signTypedDataAsync,
    config,
    message,
    refetch,
  ]);

  return {
    isCallingPermit2Deposit,
    permit2Deposit,
    isReadyToCallingPermit2Deposit:
      allowanceToPermit2?.status === "success" && account.isConnected,
  };
};
