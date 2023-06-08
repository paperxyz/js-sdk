export const ChainToPublicRpc: Record<Chain, string> = {
  Ethereum: "https://rpc.ankr.com/eth",
  Goerli: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  Mumbai: "https://rpc-mumbai.maticvigil.com",
  Polygon: "https://rpc-mainnet.maticvigil.com",
  Avalanche: "https://api.avax.network/ext/bc/C/rpc",
  Optimism: "https://optimism.rpc.thirdweb.com",
  OptimismGoerli: "https://optimism-goerli.rpc.thirdweb.com",
  BSC: "https://binance.rpc.thirdweb.com",
  BSCTestnet: "https://binance-testnet.rpc.thirdweb.com",
  ArbitrumOne: "https://arbitrum.rpc.thirdweb.com",
  ArbitrumGoerli: "https://arbitrum-goerli.rpc.thirdweb.com",
  Fantom: "https://fantom.rpc.thirdweb.com",
  FantomTestnet: "https://fantom-testnet.rpc.thirdweb.com",
  Sepolia: "https://sepolia.rpc.thirdweb.com",
  AvalancheFuji: "https://api.avax-test.network/ext/bc/C/rpc",
};

// General Embedded wallet types
export type Chain =
  | "Polygon"
  | "Mumbai"
  | "Goerli"
  | "Ethereum"
  | "Avalanche"
  | "Optimism"
  | "OptimismGoerli"
  | "BSC"
  | "BSCTestnet"
  | "ArbitrumOne"
  | "ArbitrumGoerli"
  | "Fantom"
  | "FantomTestnet"
  | "Sepolia"
  | "AvalancheFuji";

export type SupportedChainName = Chain | "Rinkeby" | "Solana" | "SolanaDevnet";
