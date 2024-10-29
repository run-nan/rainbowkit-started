import { Flex, Button, Typography, Alert } from "antd";
import { useAccount, useChainId } from "wagmi";
import { useReadPermitToken } from "./use-read-permit-token";
import { useMintPermitToken } from "./use-mint-permit-token";
import { usePermitDeposit } from "./use-permit-deposit";
import { usePermit2Deposit } from "./use-permit2-deposit";
import { mainnet } from "wagmi/chains";

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

  const chainId = useChainId();
  return (
    <Flex vertical gap={10}>
      <Typography.Title level={3}>Permit Token</Typography.Title>
      {chainId === mainnet.id ? (
        <Alert message="没钱部署到主网，请在测试网络测试该功能" />
      ) : (
        <Flex gap={10} align="center">
          {permitToken?.state?.balance?.status === "success" && (
            <Typography.Text>
              余额:{" "}
              {(permitToken?.state?.balance?.result / 10n ** 2n).toString()} $PT
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
      )}
    </Flex>
  );
};
