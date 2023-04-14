import { Wallet } from "@rainbow-me/rainbowkit";
import { RainbowKitProviderProps } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitProvider";
import { ChainProviderFn } from "wagmi";
import { PaperEmbeddedWalletRainbowKitWalletProps } from "../interfaces/wallet";

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
}
