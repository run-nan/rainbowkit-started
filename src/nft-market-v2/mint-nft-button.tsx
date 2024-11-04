import { Button, Tooltip } from "antd";
import { useState, useCallback } from "react";
import { useAccount } from "wagmi";

interface Props {
  address: `0x${string}`;
  name: string;
  symbol: string;
  mint: (nftCA: `0x${string}`) => Promise<void>;
}

export const MintNFTButton = ({ name, symbol, mint, address }: Props) => {
  const [isMinting, setIsMinting] = useState(false);
  const onMint = useCallback(async () => {
    setIsMinting(true);
    await mint(address);
    setIsMinting(false);
  }, [mint, address]);
  const account = useAccount();
  return (
    <Tooltip title={address}>
      <Button
        type="primary"
        disabled={!account.isConnected}
        loading={isMinting}
        onClick={onMint}
      >
        {name} ({symbol})
      </Button>
    </Tooltip>
  );
};
