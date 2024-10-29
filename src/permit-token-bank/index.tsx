import { Flex, Button, Typography } from "antd";
import { useAccount } from "wagmi";
import { useReadPermitToken } from "./use-read-permit-token";
import { useMintPermitToken } from "./use-mint-permit-token";
import { usePermitDeposit } from "./use-permit-deposit";
import { usePermit2Deposit } from "./use-permit2-deposit";

export const PermitTokenBank = () => {
  const account = useAccount();
  const permitToken = useReadPermitToken(account);
  const { isMinting, mintPermitToken } = useMintPermitToken(
    account,
    permitToken
  );
  const { isCallingPermitDeposit, isReadyToPermitDeposit, permitDeposit } =
    usePermitDeposit(account, permitToken);

  const {
    isCallingPermit2Deposit,
    isReadyToCallingPermit2Deposit,
    permit2Deposit,
  } = usePermit2Deposit(account, permitToken);
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
        disabled={!isReadyToPermitDeposit}
        loading={isCallingPermitDeposit}
        onClick={permitDeposit}
      >
        Permit deposit 100 $PT
      </Button>
      <Button
        disabled={!isReadyToCallingPermit2Deposit}
        loading={isCallingPermit2Deposit}
        type="primary"
        onClick={permit2Deposit}
      >
        Permit2 deposit 100 $PT
      </Button>
    </Flex>
  );
};
