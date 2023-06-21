import { css } from "@emotion/css";
import { Transition } from "@headlessui/react";
import type {
  CheckoutWithEthLinkArgs,
  CheckoutWithEthMessageHandlerArgs,
  PriceSummary,
} from "@paperxyz/js-client-sdk";
import {
  PAY_WITH_ETH_ERROR,
  PayWithCryptoErrorCode,
} from "@paperxyz/js-client-sdk";
import { DEFAULT_BRAND_OPTIONS } from "@paperxyz/sdk-common-utilities";
import { createClient as createClientCore } from "@wagmi/core";
import type { ethers } from "ethers";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useAccount } from "../../lib/hooks/useAccount";
import { useCheckoutWithEthLink } from "../../lib/hooks/useCheckoutWithEthLink";
import { useSendTransaction } from "../../lib/hooks/useSendTransaction";
import { useSwitchNetwork } from "../../lib/hooks/useSwitchNetwork";
import { handlePayWithCryptoError } from "../../lib/utils/handleError";
import { postMessageToIframe } from "../../lib/utils/postMessageToIframe";
import {
  commonTransitionProps,
  transitionContainer,
} from "../../lib/utils/styles";
import { ConnectWallet } from "../common/ConnectWallet";
import { IFrameWrapper } from "../common/IFrameWrapper";
import { SpinnerWrapper } from "../common/SpinnerWrapper";

const packageJson: any = require("../../../package.json");

export enum CheckoutWithEthPage {
  ConnectWallet,
  PaymentDetails,
}

type CheckoutWithEthProps = {
  onWalletConnected?: onWalletConnectedType;
  onPageChange?: (currentPage: CheckoutWithEthPage) => void;
  rpcUrls?: string[];
} & Omit<CheckoutWithEthLinkArgs, "payingWalletSigner"> &
  Omit<CheckoutWithEthMessageHandlerArgs, "payingWalletSigner" | "iframe"> & {
    payingWalletSigner?: ethers.Signer;
    appName?: string;
  };

export const CheckoutWithEthInternal = ({
  sdkClientSecret,
  configs,
  payingWalletSigner: _payingWalletSigner,
  setUpUserPayingWalletSigner,
  receivingWalletType,
  suppressErrorToast,
  showConnectWalletOptions: _showConnectWalletOptions = true,
  options: _options,
  onError,
  onSuccess,
  // This is fired when the transaction is sent to chain, the transaction might still fail there for whatever reason.
  onPaymentSuccess,
  onWalletConnected,
  onPageChange,
  onPriceUpdate,
  locale,
}: CheckoutWithEthProps): React.ReactElement => {
  const { data: _signer } = useSigner();
  const { disconnect } = useDisconnect();
  const payingWalletSigner = _payingWalletSigner ?? _signer;
  const { switchNetworkAsync } = useSwitchNetwork({
    signer: payingWalletSigner ?? undefined,
  });
  const { sendTransactionAsync } = useSendTransaction({
    signer: payingWalletSigner ?? undefined,
  });
  const { chainId } = useAccount({
    signer: payingWalletSigner ?? undefined,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [showConnectWalletOptions, setShowConnectWalletOptions] = useState(
    _showConnectWalletOptions,
  );
  const [isClientSide, setIsClientSide] = useState(false);

  const options = useMemo<{
    colorPrimary?: string;
    colorBackground?: string;
    colorText?: string;
    borderRadius?: number;
    fontFamily?: string;
  }>(() => {
    return (
      _options || {
        ...DEFAULT_BRAND_OPTIONS,
      }
    );
  }, [_options]);

  const { checkoutWithEthUrl } = useCheckoutWithEthLink({
    payingWalletSigner: payingWalletSigner,
    sdkClientSecret,
    locale,
    options,
    receivingWalletType,
    showConnectWalletOptions,
    configs,
  });

  const onLoad = useCallback(() => {
    setIsIframeLoading(false);
  }, []);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    if (onPageChange) {
      if (!!payingWalletSigner || !showConnectWalletOptions) {
        onPageChange(CheckoutWithEthPage.PaymentDetails);
      } else if (showConnectWalletOptions && !payingWalletSigner) {
        onPageChange(CheckoutWithEthPage.ConnectWallet);
      }
    }
  }, [showConnectWalletOptions, payingWalletSigner, onPageChange]);

  useEffect(() => {
    if (!iframeRef.current || !payingWalletSigner) return;

    const handleMessage = async (event: MessageEvent) => {
      // additional event listener for react client
      // This allows us to have the ability to have wallet connection handled by the SDK
      if (!("data" in event)) return;

      const { data } = event as {
        data: Record<string, any>;
      };
      switch (data.eventType) {
        case "onPriceUpdate": {
          onPriceUpdate?.(data as PriceSummary);
          return;
        }
        case "payWithEth": {
          if (data.error) {
            handlePayWithCryptoError(
              new Error((data.error as string) ?? ""),
              onError,
              (errorObject) => {
                if (iframeRef.current) {
                  postMessageToIframe(iframeRef.current, PAY_WITH_ETH_ERROR, {
                    error: errorObject,
                    suppressErrorToast,
                  });
                }
              },
            );
            return;
          }

          // Allows Dev's to inject any chain switching for their custom payingWalletSigner here.
          if (payingWalletSigner && setUpUserPayingWalletSigner) {
            try {
              console.log("setting up payingWalletSigner");
              await setUpUserPayingWalletSigner({ chainId: data.chainId });
            } catch (error) {
              console.log("error setting up payingWalletSigner", error);
              handlePayWithCryptoError(
                error as Error,
                onError,
                (errorObject) => {
                  if (iframeRef.current) {
                    postMessageToIframe(iframeRef.current, PAY_WITH_ETH_ERROR, {
                      error: errorObject,
                      suppressErrorToast,
                    });
                  }
                },
              );
              return;
            }
          }

          // try switching network first if needed or supported
          try {
            if (chainId !== data.chainId && switchNetworkAsync) {
              console.log(
                `switching payingWalletSigner network to chainId: ${chainId}`,
              );
              await switchNetworkAsync(data.chainId);
            } else if (chainId !== data.chainId) {
              throw {
                isErrorObject: true,
                title: PayWithCryptoErrorCode.WrongChain,
                description: `Please change to ${data.chainName} to proceed.`,
              };
            }
          } catch (error) {
            console.log("error switching network");
            handlePayWithCryptoError(error as Error, onError, (errorObject) => {
              if (iframeRef.current) {
                postMessageToIframe(iframeRef.current, PAY_WITH_ETH_ERROR, {
                  error: errorObject,
                  suppressErrorToast,
                });
              }
            });
            return;
          }

          // send the transaction
          try {
            console.log("sending funds...", data);
            const result = await sendTransactionAsync?.({
              chainId: data.chainId,
              request: {
                value: data.value,
                data: data.blob,
                to: data.paymentAddress,
              },
              mode: "recklesslyUnprepared",
            });
            if (!result) {
              throw new Error(`Unable to send transaction.`);
            }
            const { response, receipt } = result;

            if (iframeRef.current && receipt) {
              await onPaymentSuccess?.({
                onChainTxReceipt: receipt,
                transactionId: data.transactionId,
              });
              await onSuccess?.({
                onChainTxResponse: response,
                transactionId: data.transactionId,
              });
              postMessageToIframe(iframeRef.current, "paymentSentToChain", {
                suppressErrorToast,
                transactionHash: receipt.transactionHash,
              });
            }
          } catch (error) {
            console.log("error sending funds", error);
            handlePayWithCryptoError(error as Error, onError, (errorObject) => {
              if (iframeRef.current) {
                postMessageToIframe(iframeRef.current, PAY_WITH_ETH_ERROR, {
                  error: errorObject,
                  suppressErrorToast,
                });
              }
            });
          }
          break;
        }
        case "goBackToChoosingWallet": {
          disconnect();
          setShowConnectWalletOptions(true);
          break;
        }
        case "checkout-with-eth-sizing": {
          if (iframeRef.current) {
            iframeRef.current.style.height = data.height + "px";
            iframeRef.current.style.maxHeight = data.height + "px";
          }
          break;
        }
        default:
          break;
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [
    chainId,
    setUpUserPayingWalletSigner,
    suppressErrorToast,
    onPriceUpdate,
    onError,
    switchNetworkAsync,
    sendTransactionAsync,
    onPaymentSuccess,
    payingWalletSigner,
    onSuccess,
    disconnect,
  ]);

  return (
    <div
      className={transitionContainer}
      data-paper-sdk-version={`@paperxyz/react-client-sdk@${packageJson.version}`}
    >
      {isClientSide &&
        (showConnectWalletOptions || !payingWalletSigner ? (
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
                  disconnect();
                }
              }}
            />
          </Transition>
        ) : (
          <Transition show={true} {...commonTransitionProps}>
            {isIframeLoading || (!checkoutWithEthUrl && <SpinnerWrapper />)}
            {checkoutWithEthUrl && (
              <IFrameWrapper
                ref={iframeRef}
                id="checkout-with-eth-iframe"
                className={css`
                  margin-left: auto;
                  margin-right: auto;
                  transition-property: all;
                  width: 100%;
                  height: 100%;
                  min-height: 300px;
                  color-scheme: light;
                `}
                src={checkoutWithEthUrl.href}
                onLoad={onLoad}
                scrolling="no"
                allowTransparency
              />
            )}
          </Transition>
        ))}
    </div>
  );
};

export const CheckoutWithEth = (
  props: CheckoutWithEthProps,
): React.ReactElement => {
  let providers = [
    publicProvider(),
    ...Object.values(chain).map((_chain) =>
      jsonRpcProvider({
        rpc: () => ({ http: _chain.rpcUrls[0] ?? "" }),
      }),
    ),
  ];
  if (props.rpcUrls) {
    // Use the RPC URLs provided by the developer instead of a public, rate-limited one.
    providers = props.rpcUrls.map((http) =>
      jsonRpcProvider({
        rpc: () => ({ http }),
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
    [chains, provider],
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
