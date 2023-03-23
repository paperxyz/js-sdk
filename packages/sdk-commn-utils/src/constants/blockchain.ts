export const ChainToPublicRpc: Record<Chain, string> = {
  Ethereum: "https://rpc.ankr.com/eth",
  Goerli: "https://eth-goerli.g.alchemy.com/v2/demo",
  Mumbai: "https://rpc-mumbai.maticvigil.com",
  Polygon: "https://rpc-mainnet.maticvigil.com",
  Avalanche: "https://api.avax.network/ext/bc/C/rpc",
};

// General Embedded wallet types
export type Chain = "Polygon" | "Mumbai" | "Goerli" | "Ethereum" | "Avalanche";
