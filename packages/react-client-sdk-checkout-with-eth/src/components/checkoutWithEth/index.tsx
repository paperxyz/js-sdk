import { Transition } from "@headlessui/react";
import { PayWithCryptoErrorCode } from "@paperxyz/js-client-sdk";
import {
  arbitrum,
  arbitrumGoerli,
  arbitrumNova,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  baseGoerli,
  boba,
  bronos,
  bronosTestnet,
  bsc,
  bscTestnet,
  canto,
  celo,
  celoAlfajores,
  celoCannoli,
  confluxESpace,
  cronos,
  crossbell,
  dfk,
  dogechain,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinCalibration,
  filecoinHyperspace,
  flare,
  flareTestnet,
  foundry,
  fuse,
  gnosis,
  gnosisChiado,
  goerli,
  haqqMainnet,
  haqqTestedge2,
  hardhat,
  harmonyOne,
  iotex,
  iotexTestnet,
  klaytn,
  lineaTestnet,
  localhost,
  mainnet,
  metis,
  metisGoerli,
  moonbaseAlpha,
  moonbeam,
  moonriver,
  neonDevnet,
  nexi,
  oasys,
  okc,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
  pulsechain,
  pulsechainV4,
  scrollTestnet,
  sepolia,
  shardeumSphinx,
  skaleBlockBrawlers,
  skaleCalypso,
  skaleCalypsoTestnet,
  skaleChaosTestnet,
  skaleCryptoBlades,
  skaleCryptoColosseum,
  skaleEuropa,
  skaleEuropaTestnet,
  skaleExorde,
  skaleHumanProtocol,
  skaleNebula,
  skaleNebulaTestnet,
  skaleRazor,
  skaleTitan,
  skaleTitanTestnet,
  songbird,
  songbirdTestnet,
  syscoin,
  taraxa,
  taraxaTestnet,
  telos,
  telosTestnet,
  thunderTestnet,
  wanchain,
  wanchainTestnet,
  xdc,
  xdcTestnet,
  zhejiang,
  zkSync,
  zkSyncTestnet,
} from "@wagmi/chains";
import { createClient as createClientCore } from "@wagmi/core";
import React, { useEffect, useMemo, useState } from "react";
import {
  WagmiConfig,
  configureChains,
  createClient,
  useDisconnect,
  useSigner
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

export const WagmiChains = [
  arbitrum,
  arbitrumGoerli,
  arbitrumNova,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  baseGoerli,
  boba,
  bronos,
  bronosTestnet,
  bsc,
  bscTestnet,
  canto,
  celo,
  celoAlfajores,
  celoCannoli,
  confluxESpace,
  cronos,
  crossbell,
  dfk,
  dogechain,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinCalibration,
  filecoinHyperspace,
  flare,
  flareTestnet,
  foundry,
  fuse,
  iotex,
  iotexTestnet,
  goerli,
  gnosis,
  gnosisChiado,
  hardhat,
  harmonyOne,
  haqqMainnet,
  haqqTestedge2,
  klaytn,
  lineaTestnet,
  localhost,
  mainnet,
  metis,
  metisGoerli,
  moonbaseAlpha,
  moonbeam,
  moonriver,
  neonDevnet,
  nexi,
  oasys,
  okc,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  polygonZkEvmTestnet,
  polygonZkEvm,
  pulsechain,
  pulsechainV4,
  scrollTestnet,
  sepolia,
  skaleBlockBrawlers,
  skaleCalypso,
  skaleCalypsoTestnet,
  skaleChaosTestnet,
  skaleCryptoBlades,
  skaleCryptoColosseum,
  skaleEuropa,
  skaleEuropaTestnet,
  skaleExorde,
  skaleHumanProtocol,
  skaleNebula,
  skaleNebulaTestnet,
  skaleRazor,
  skaleTitan,
  skaleTitanTestnet,
  songbird,
  songbirdTestnet,
  shardeumSphinx,
  syscoin,
  taraxa,
  taraxaTestnet,
  telos,
  telosTestnet,
  thunderTestnet,
  wanchain,
  wanchainTestnet,
  xdc,
  xdcTestnet,
  zhejiang,
  zkSync,
  zkSyncTestnet,
]

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
  onSuccess,
  // This is fired when the transaction is sent to chain, the transaction might still fail there for whatever reason.
  onPaymentSuccess: _onPaymentSuccess,
  onWalletConnected,
  onPageChange,
  onPriceUpdate,
  locale,
}: CheckoutWithEthProps): React.ReactElement => {
  const onPaymentSuccess = _onPaymentSuccess ?? onSuccess;

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
                  // @ts-ignore
                  onPaymentSuccess={onPaymentSuccess}
                  onPriceUpdate={onPriceUpdate}
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
  let providers = [
    publicProvider(),
     ...WagmiChains.map((_chain) =>
      jsonRpcProvider({
        rpc: () => ({ http: _chain.rpcUrls.public.http[0] ?? "" }),
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

   const { chains, provider } = configureChains(WagmiChains, providers);
  const client = useMemo(
    () =>
      createClient({
        autoConnect: true,
        connectors: [
          new MetaMaskConnector({
            chains,
            options: {
              shimDisconnect: true,
              UNSTABLE_shimOnConnectSelectAccount: true,
            },
          }),
          new WalletConnectConnector({
            chains,
            options: {
              projectId: `c33a8bd99947000acab7a7fdf13c3b80`,
              showQrModal: true,
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
          shimDisconnect: true,
          UNSTABLE_shimOnConnectSelectAccount: true,
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: `c33a8bd99947000acab7a7fdf13c3b80`,
          showQrModal: true,
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
