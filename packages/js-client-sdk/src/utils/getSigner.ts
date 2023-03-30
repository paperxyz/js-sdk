import type { ethers } from "ethers";
import { ALCHEMY_API_KEY } from "../constants/settings";
import { createConnectWalletButton } from "./CheckoutWithEth/createConnectWalletButton";
import { createWalletConnectorContainer } from "./CheckoutWithEth/createWalletConnectorContainer";
import { isTestnet } from "./CheckoutWithEth/isTestnet";
import { setUpSigner } from "./CheckoutWithEth/setUpSigner";
import { walletDisplayName } from "./CheckoutWithEth/walletDisplayName";

export async function getSignerInfo({
  container,
  sdkClientSecret,
  appName,
}: {
  container: HTMLElement;
  sdkClientSecret: string;
  appName?: string;
}) {
  try {
    // Wagmi only supports esm modules which we cannot really use bcause we compile down to cjs too (for now).
    // One of the way aside from cutting out cjs is to use dynamic import as below
    const {
      fetchSigner,
      configureChains,
      connect,
      createClient,
      goerli,
      mainnet,
    } = await import("@wagmi/core");
    const { MetaMaskConnector } = await import(
      "@wagmi/core/connectors/metaMask"
    );
    const { WalletConnectLegacyConnector } = await import(
      "@wagmi/core/connectors/walletConnectLegacy"
    );
    const { CoinbaseWalletConnector } = await import(
      "@wagmi/core/connectors/coinbaseWallet"
    );
    const { alchemyProvider } = await import("@wagmi/core/providers/alchemy");

    const payloadObj = JSON.parse(
      Buffer.from(sdkClientSecret.split(".")[1], "base64").toString("utf-8"),
    );
    if (!payloadObj) {
      throw new Error("Invalid sdkClientSecret given");
    }
    // TODO: Stop hacking types LoL
    const chainName = payloadObj.pricingDetails.chainName;
    const isTestnetChain = isTestnet(chainName);
    const chains = isTestnetChain ? [goerli] : [mainnet];
    const { provider, webSocketProvider } = configureChains(
      // wagmi typing needs at least a testnet LoL
      [mainnet, goerli],
      [
        alchemyProvider({
          apiKey: ALCHEMY_API_KEY,
        }),
      ],
    );
    const metamaskConnector = new MetaMaskConnector({
      chains,
    });
    const walletConnectConnector = new WalletConnectLegacyConnector({
      options: {
        qrcode: true,
      },
    });
    const coinbaseConnector = new CoinbaseWalletConnector({
      options: {
        appName: appName ?? "Paper",
        jsonRpcUrl: isTestnetChain
          ? `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
          : `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
        chainId: chains[0].id,
      },
    });

    const client = createClient({
      provider,
      webSocketProvider,
      connectors: [
        metamaskConnector,
        walletConnectConnector,
        coinbaseConnector,
      ],
    });
    await client.autoConnect();
    const existingSigner = await fetchSigner();

    const connectWalletPageId = "paper-connect-wallet-page";
    const existingPage = document.getElementById(connectWalletPageId);

    if (existingPage && existingSigner) {
      const result = await setUpSigner({
        chainId: chains[0].id,
        onSuccess: () => {
          existingPage.style.display = "none";
        },
        signer: existingSigner,
      });
      if (result) {
        return result;
      }
    } else if (existingPage) {
      return;
    }
    return new Promise<{ signer: ethers.Signer; walletType?: string }>(
      async (res) => {
        const connectWalletPage =
          createWalletConnectorContainer(connectWalletPageId);

        container.appendChild(connectWalletPage);

        for (const connector of client.connectors) {
          const displayName =
            walletDisplayName(connector.name) ?? connector.name;
          const connectWalletButton = createConnectWalletButton(displayName);
          connectWalletButton.onclick = async () => {
            try {
              await connect({
                connector: connector,
              });
            } catch (e) {
              console.error(e);
            }
            const signer = await fetchSigner();
            const result = await setUpSigner({
              chainId: chains[0].id,
              onSuccess: () => {
                connectWalletPage.style.display = "none";
              },
              signer,
              walletType: displayName,
            });
            if (result) {
              res(result);
            }
          };
          connectWalletPage.appendChild(connectWalletButton);
        }
      },
    );
  } catch (err) {
    console.log("error on connect wallet page", err);
    throw err;
  }
}
