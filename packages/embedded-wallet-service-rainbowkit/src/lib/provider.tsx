import { getChain } from "@paperxyz/embedded-wallet-service-wagmi";
import {
  RainbowKitProvider,
  connectorsForWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";

import {
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import React from "react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import type { PaperEmbeddedWalletProviderProps } from "../interfaces/provider";
import { PaperEmbeddedWalletRainbowKitWallet } from "./wallet";
import { Chain } from "@paperxyz/sdk-common-utilities";

export const PaperEmbeddedWalletProvider = ({
  appName,
  providers = [publicProvider()],
  otherWallets,
  modalOptions,
  walletOptions,
  children,
  supportedChains
}: React.PropsWithChildren<PaperEmbeddedWalletProviderProps>): React.ReactElement => {
  const selectedChains = supportedChains.map((chain:Chain) => getChain(chain));
  const { chains, provider, webSocketProvider } = configureChains(
    selectedChains,
    providers,
  );

  // Apply default options.
  const providerOptions = modalOptions ?? {};
  providerOptions.modalSize ??= "compact";
  providerOptions.theme ??= lightTheme({
    borderRadius: "small",
  });

  const connectors = connectorsForWallets([
    {
      groupName: "Log In With Email",
      wallets: [PaperEmbeddedWalletRainbowKitWallet(walletOptions, selectedChains)],
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

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} {...providerOptions}>
        {/* Lower the z-index of RainbowKit's modal in favor of Paper's modal. */}
        <style>{`
        [data-rk] [aria-labelledby="rk_connect_title"] {
          z-index: 2147483645 !important;
        }
        `}</style>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
