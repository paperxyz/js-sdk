import { getChain } from "@paperxyz/embedded-wallet-service-wagmi";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import React from "react";
import { configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  PaperEmbeddedWalletProviderProps,
  RequiredModalOptions,
} from "../interfaces/provider";
import { PaperEmbeddedWalletRainbowKitWallet } from "./wallet";

export const PaperEmbeddedWalletProvider = ({
  appName,
  providers = [publicProvider()],
  otherWallets,
  modalOptions,
  walletOptions,
  children,
}: React.PropsWithChildren<PaperEmbeddedWalletProviderProps>): React.ReactElement => {
  const chain = getChain(walletOptions.chain);
  const { chains, provider, webSocketProvider } = configureChains(
    [chain],
    providers,
  );

  // Apply default options.
  const providerOptions: RequiredModalOptions = {
    ...modalOptions,
    modalSize: "compact",
  };

  const connectors = connectorsForWallets([
    {
      groupName: "Log In With Email",
      wallets: [PaperEmbeddedWalletRainbowKitWallet(walletOptions)],
    },
    {
      groupName: "Log In With Wallet",
      wallets: otherWallets ?? [
        metaMaskWallet({ chains }),
        walletConnectWallet({ chains }),
        coinbaseWallet({ appName, chains }),
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
  });

  /* Lower the z-index of RainbowKit's modal in favor of Paper's modal. */
  // <style>{`
  // [data-rk] [aria-labelledby="rk_connect_title"] {
  //   z-index: 2147483645 !important;
  // }
  // `}</style>
  // {children}

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} {...providerOptions}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
