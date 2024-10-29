import { useState } from "react";
import { App } from "antd";
import { useConfig, useWriteContract } from "wagmi";
import { PERMIT_TOKEN_ABI, PERMIT_TOKEN_CA } from "../constants/permit-token";
import { useCallback } from "react";
import { waitForTransactionReceipt } from "wagmi/actions";
import type { Account, PermitTokenType } from "./use-read-permit-token";

export const useMintPermitToken = (
  account: Account,
  permitToken: PermitTokenType
) => {
  const { writeContractAsync } = useWriteContract();
  const [isMinting, setIsMinting] = useState(false);
  const { refetch } = permitToken;
  const config = useConfig();
  const { message } = App.useApp();
  const mintPermitToken = useCallback(async () => {
    setIsMinting(true);
    try {
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
    } catch (error) {
      console.error(error);
      message.error(`ERROR: ${error?.toString()}`);
    }
    setIsMinting(false);
  }, [writeContractAsync, account.address, refetch, config, message]);
  return {
    mintPermitToken,
    isMinting,
  };
};
