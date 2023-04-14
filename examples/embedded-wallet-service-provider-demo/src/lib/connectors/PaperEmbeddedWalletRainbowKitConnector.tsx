import type { Wallet } from "@rainbow-me/rainbowkit";
import type { IPaperEmbeddedWalletWagmiConnectorOptions } from "./PaperEmbeddedWalletWagmiConnector";
import { PaperEmbeddedWalletWagmiConnector } from "./PaperEmbeddedWalletWagmiConnector";

/**
 * Connector for RainbowKit.
 */
export const paperEmbeddedWalletRainbowKitConnector = (
  config: IPaperEmbeddedWalletWagmiConnectorOptions,
): Wallet => ({
  id: "paper",
  name: "Paper",
  iconUrl: "https://withpaper.com/icons/paper-logo-icon.svg",
  iconBackground: "#fff",
  createConnector: () => {
    const { chains, options } = config;
    const connector = new PaperEmbeddedWalletWagmiConnector({
      chains,
      options,
    });
    return { connector };
  },
});
