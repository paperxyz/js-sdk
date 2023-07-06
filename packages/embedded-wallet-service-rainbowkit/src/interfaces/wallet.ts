import type { Networkish } from "@ethersproject/providers";
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
   * The background color to show when the icon has transparency.
   *
   * @defaultValue `"#39D0FF"`
   */
  iconBackground?: string;

  /**
   * The RPC endpoint for the Signer.
   * Uses a public RPC provider if not provided.
   */
  rpcEndpoint?: Networkish;
} & PaperConstructorType;
