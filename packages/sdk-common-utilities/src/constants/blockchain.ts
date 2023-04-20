export const ChainToPublicRpc: Record<Chain, string> = {
  Ethereum: "https://rpc.ankr.com/eth",
  Goerli: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  Mumbai: "https://rpc-mumbai.maticvigil.com",
  Polygon: "https://rpc-mainnet.maticvigil.com",
  Avalanche: "https://api.avax.network/ext/bc/C/rpc",
};

// General Embedded wallet types
export type Chain = "Polygon" | "Mumbai" | "Goerli" | "Ethereum" | "Avalanche";

export type SupportedChainName = Chain | "Rinkeby" | "Solana" | "SolanaDevnet";
