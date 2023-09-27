import { getChain } from "@paperxyz/embedded-wallet-service-wagmi";
import {
  RainbowKitProvider,
  connectorsForWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";

import type { Chain as InternalChain } from "@paperxyz/sdk-common-utilities";
import {
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import React from "react";
import type { Chain } from 'wagmi';
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import type { PaperEmbeddedWalletProviderProps } from "../interfaces/provider";
import { PaperEmbeddedWalletRainbowKitWallet } from "./wallet";

export const PaperEmbeddedWalletProvider = ({
  appName,
  projectId,
  otherWallets,
  modalOptions,
  walletOptions,
  children,
  supportedChains,
}: React.PropsWithChildren<PaperEmbeddedWalletProviderProps>): React.ReactElement => {
  let selectedChains: Chain[];
  if (!supportedChains || !supportedChains.length) {
    selectedChains = [getChain(walletOptions.chain)];
  } else {
    selectedChains = supportedChains.map((chain: InternalChain) => getChain(chain));
  }

  const {
    chains,
    publicClient,
    webSocketPublicClient
  } = configureChains(
    [mainnet],
    [publicProvider()],
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
      wallets: [
        PaperEmbeddedWalletRainbowKitWallet(walletOptions, selectedChains),
      ],
    },
    {
      groupName: "Log In With Wallet",
      wallets: otherWallets ?? [
        metaMaskWallet({ chains, projectId }),
        walletConnectWallet({ chains, projectId }),
        coinbaseWallet({ appName, chains }),
      ],
    },
  ]);

  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
    connectors,
  });

  return (
    <WagmiConfig config={config}>
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
