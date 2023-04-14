import type { PaperConstructorType } from "@paperxyz/embedded-wallet-service-sdk";

export type PaperEmbeddedWalletRainbowKitWalletProps = {
  /**
   * The name shown on the RainbowKit modal.
   *
   * @defaultValue `"Email"`
   */
  name?: string;

  /**
   * The icon image shown beside the name.
   *
   * @defaultValue `""`
   */
  iconUrl?: string;

  /**
   * @defaultValue `"#39D0FF"`
   */
  iconBackground?: string;
} & PaperConstructorType;
