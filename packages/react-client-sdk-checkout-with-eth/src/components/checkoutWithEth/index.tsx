import { Transition } from "@headlessui/react";
import { PayWithCryptoErrorCode } from "@paperxyz/js-client-sdk";
import { createClient as createClientCore } from "@wagmi/core";
import React, { useEffect, useMemo, useState } from "react";
import {
  WagmiConfig,
  chain,
  configureChains,
  createClient,
  useDisconnect,
  useSigner,
} from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import type { onWalletConnectedType } from "../../interfaces/WalletTypes";
import { WalletType } from "../../interfaces/WalletTypes";

import {
  commonTransitionProps,
  transitionContainer,
} from "../../lib/utils/styles";
import { ConnectWallet } from "../common/ConnectWallet";
import type { ViewPricingDetailsProps } from "./ViewPricingDetails";
import { ViewPricingDetails } from "./ViewPricingDetails";

const packageJson = require("../../../package.json");

export enum CheckoutWithEthPage {
  ConnectWallet,
  PaymentDetails,
}

type CheckoutWithEthProps = {
  onWalletConnected?: onWalletConnectedType;
  onPageChange?: (currentPage: CheckoutWithEthPage) => void;
  rpcUrls?: string[];
} & Omit<ViewPricingDetailsProps, "setShowConnectWalletOptions">;

export const CheckoutWithEthInternal = ({
  sdkClientSecret,
  configs,
  payingWalletSigner,
  setUpUserPayingWalletSigner,
  receivingWalletType,
  suppressErrorToast,
  showConnectWalletOptions: _showConnectWalletOptions = true,
  options,
  onError,
  // This is fired when the transaction is sent to chain, the transaction might still fail there for whatever reason.
  onSuccess,
  onWalletConnected,
  onPageChange,
  locale,
}: CheckoutWithEthProps): React.ReactElement => {
  const { data: _signer } = useSigner();
  const { disconnect } = useDisconnect();

  const [showConnectWalletOptions, setShowConnectWalletOptions] =
    useState(true);
  const [isClientSide, setIsClientSide] = useState(false);
  const actualSigner = payingWalletSigner || _signer;
  const isJsonRpcSignerPresent = !!actualSigner;

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    if (onPageChange) {
      if (isJsonRpcSignerPresent || !showConnectWalletOptions) {
        onPageChange(CheckoutWithEthPage.PaymentDetails);
      } else if (showConnectWalletOptions && !isJsonRpcSignerPresent) {
        onPageChange(CheckoutWithEthPage.ConnectWallet);
      }
    }
  }, [showConnectWalletOptions, isJsonRpcSignerPresent]);

  console.log({
    showConnectWalletOptions,
    isJsonRpcSignerPresent,
  });
  return (
    <div
      className={transitionContainer}
      data-paper-sdk-version={`@paperxyz/react-client-sdk@${packageJson.version}`}
    >
      {isClientSide &&
        (() => {
          if (showConnectWalletOptions && !isJsonRpcSignerPresent) {
            return (
              <Transition show={true} {...commonTransitionProps}>
                <ConnectWallet
                  onWalletConnected={({ userAddress, chainId }) => {
                    setShowConnectWalletOptions(false);
                    if (onWalletConnected) {
                      onWalletConnected({ userAddress, chainId });
                    }
                  }}
                  onWalletConnectFail={({
                    walletType,
                    currentUserWalletType,
                    error,
                  }) => {
                    // coinbase will fail if we try to go back and connect again. because we never disconnected.
                    // we'll get the error of "user already connected". We simply ignore it here.
                    if (
                      walletType === WalletType.CoinbaseWallet &&
                      currentUserWalletType === walletType
                    ) {
                      setShowConnectWalletOptions(false);
                      return;
                    }
                    if (onError) {
                      onError({
                        code: PayWithCryptoErrorCode.ErrorConnectingToWallet,
                        error,
                      });
                    }
                  }}
                />
              </Transition>
            );
          } else {
            return (
              <Transition show={true} {...commonTransitionProps}>
                <ViewPricingDetails
                  configs={configs}
                  sdkClientSecret={sdkClientSecret}
                  payingWalletSigner={actualSigner || undefined}
                  receivingWalletType={receivingWalletType}
                  setUpUserPayingWalletSigner={setUpUserPayingWalletSigner}
                  onError={onError}
                  onSuccess={(transactionResponse) => {
                    if (onSuccess) {
                      onSuccess(transactionResponse);
                    }
                  }}
                  showConnectWalletOptions={showConnectWalletOptions}
                  suppressErrorToast={suppressErrorToast}
                  options={options}
                  onChangeWallet={() => {
                    setShowConnectWalletOptions(true);
                    disconnect();
                  }}
                  locale={locale}
                />
              </Transition>
            );
          }
        })()}
    </div>
  );
};

export const CheckoutWithEth = (
  props: CheckoutWithEthProps,
): React.ReactElement => {
  let providers = [publicProvider()];
  if (props.rpcUrls) {
    // Use the RPC URLs provided by the developer instead of a public, rate-limited one.
    providers = props.rpcUrls.map((http) =>
      jsonRpcProvider({
        rpc: (chain) => ({ http }),
      }),
    );
  }

  const { chains, provider } = configureChains(Object.values(chain), providers);
  const client = useMemo(
    () =>
      createClient({
        autoConnect: true,
        connectors: [
          new MetaMaskConnector({
            chains,
            options: {
              shimChainChangedDisconnect: true,
              shimDisconnect: true,
              UNSTABLE_shimOnConnectSelectAccount: true,
            },
          }),
          new WalletConnectConnector({
            chains,
            options: {
              qrcode: true,
            },
          }),
          new CoinbaseWalletConnector({
            chains,
            options: {
              appName: "Paper.xyz",
            },
          }),
        ],
        provider,
      }),
    [],
  );
  createClientCore({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({
        chains,
        options: {
          shimChainChangedDisconnect: true,
          shimDisconnect: true,
          UNSTABLE_shimOnConnectSelectAccount: true,
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "Paper.xyz",
        },
      }),
    ],
    provider,
  });

  return (
    <WagmiConfig client={client}>
      <CheckoutWithEthInternal {...props} />
    </WagmiConfig>
  );
};
