import {
  PaperEmbeddedWalletWagmiConnector,
  getChain,
} from "@paperxyz/embedded-wallet-service-wagmi";
import type { Wallet } from "@rainbow-me/rainbowkit";
import type { PaperEmbeddedWalletRainbowKitWalletProps } from "../interfaces/wallet";

const EMAIL_ICON_URL_BLACK_BG =
  "https://imagedelivery.net/Vr4NNRVdicbn_9_WmMTPCA/60892283-f7d9-4b1f-fcaf-57ff95e31b00/128px";

/**
 * @returns A RainbowKit-compatible Wallet.
 */
export const PaperEmbeddedWalletRainbowKitWallet = (
  config: PaperEmbeddedWalletRainbowKitWalletProps,
): Wallet => ({
  id: "paper-embedded-wallet",
  name: config.name ?? "Email",
  iconUrl: config.iconUrl ?? EMAIL_ICON_URL_BLACK_BG,
  iconBackground: config.iconBackground ?? "#39D0FF",
  createConnector: () => {
    const connector = new PaperEmbeddedWalletWagmiConnector({
      chains: [getChain(config.chain)],
      options: config,
    });
    return { connector };
  },
});
