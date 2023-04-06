import type { PaperConstructorType } from "@paperxyz/embedded-wallet-service-sdk";
import type { Chain } from "wagmi";

export interface IPaperEmbeddedWalletWagmiConnectorOptions {
  /**
   *
   */
  chains?: Chain[];

  /**
   * The options provided to the PaperEmbeddedWalletSdk constructor.
   */
  options: PaperConstructorType;
}
