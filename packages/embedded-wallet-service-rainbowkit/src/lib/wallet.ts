import { PaperEmbeddedWalletWagmiConnector } from "@paperxyz/embedded-wallet-service-wagmi";
import type { Wallet } from "@rainbow-me/rainbowkit";
import type { Chain } from "wagmi";
import type { PaperEmbeddedWalletRainbowKitWalletProps } from "../interfaces/wallet";

/**
 * A default dark mode email icon.
 * The icon itself is transparent so set `iconBackground` to change its color.
 *
 * Looking for a light mode icon? Try: https://withpaper.com/icons/paper-embedded-wallet-white.png
 */
const EMAIL_ICON_URL_BLACK_BG =
  "https://withpaper.com/icons/paper-embedded-wallet-black.png";

/**
 * @returns A RainbowKit-compatible Wallet.
 */
export const PaperEmbeddedWalletRainbowKitWallet = (
  config: PaperEmbeddedWalletRainbowKitWalletProps,
  supportedChains?: Chain[],
): Wallet => ({
  id: "paper-embedded-wallet",
  name: config.name ?? "Email",
  iconUrl: config.iconUrl ?? EMAIL_ICON_URL_BLACK_BG,
  iconBackground: config.iconBackground ?? "#39D0FF",
  createConnector: () => {
    const connector = new PaperEmbeddedWalletWagmiConnector({
      chains: supportedChains,
      options: config,
    });
    return { connector };
  },
});
