import { Flex, Typography, Button, Input, Divider, Alert } from "antd";
import { useNFTs } from "./use-nfts";
import { useNFTtokens } from "./use-nft-tokens";
import { useAccount, useChainId } from "wagmi";
import { MintNFTButton } from "./mint-nft-button";
import { NFTToken } from "./nft-token";
import { mainnet } from "wagmi/chains";

export const NFTMarketV2 = () => {
  const {
    isDeploying,
    onNameChange,
    onSymbolChange,
    deployNFT,
    name,
    symbol,
    deployedNFTs,
  } = useNFTs();
  const account = useAccount();
  const chainId = useChainId();

  const { mintNFTToken, tokens, updateNFTToken } = useNFTtokens();
  return (
    <Flex vertical gap={10}>
      <Typography.Title level={3}>NFT Market</Typography.Title>
      {chainId === mainnet.id ? (
        <Alert message="没钱部署到主网，请在测试网测试该功能" />
      ) : (
        <>
          <Flex gap={10}>
            <Input
              value={name}
              placeholder="NFT名称"
              disabled={isDeploying}
              onChange={onNameChange}
            />
            <Input
              value={symbol}
              placeholder="NFT符号"
              disabled={isDeploying}
              onChange={onSymbolChange}
            />
            <Button
              type="primary"
              disabled={!account.isConnected}
              loading={isDeploying}
              onClick={deployNFT}
            >
              部署NFT
            </Button>
          </Flex>
          {deployedNFTs.length > 0 && <Divider>Mint NFT</Divider>}
          <Flex gap={10}>
            {deployedNFTs.map((nft) => (
              <MintNFTButton
                key={nft.ca}
                name={nft.name}
                symbol={nft.symbol}
                address={nft.ca}
                mint={mintNFTToken}
              />
            ))}
          </Flex>
          <Divider>NFT Tokens</Divider>
          <Flex gap={10}>
            {tokens.map((token) => (
              <NFTToken
                key={token.tokenId}
                tokenId={token.tokenId}
                address={token.ca}
                updateNFTToken={updateNFTToken}
                listingSignature={token.listingSignature}
              />
            ))}
          </Flex>
        </>
      )}
    </Flex>
  );
};
