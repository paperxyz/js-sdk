import type { Wallet } from "@rainbow-me/rainbowkit";
import type { RainbowKitProviderProps } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitProvider";
import type { ChainProviderFn } from "wagmi";
import type { PaperEmbeddedWalletRainbowKitWalletProps } from "../interfaces/wallet";
import type { Chain } from "@paperxyz/sdk-common-utilities";

export type RequiredModalOptions = Omit<
  RainbowKitProviderProps,
  "chains" | "children"
>;

export interface PaperEmbeddedWalletProviderProps {
  appName: string;
  providers?: ChainProviderFn[];
  otherWallets?: Wallet[];
  modalOptions?: RequiredModalOptions;
  walletOptions: PaperEmbeddedWalletRainbowKitWalletProps;
  supportedChains: Chain[];
}
