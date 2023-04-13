import { Flex } from "@chakra-ui/react";
import {
  ConnectButton,
  connectorsForWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { paperEmbeddedWalletRainbowKitConnector } from "../lib/connectors/PaperEmbeddedWalletRainbowKitConnector";

const TestPage = () => {
  const { chains, provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()],
  );

  const connectors = connectorsForWallets([
    {
      groupName: "Log In With Email",
      wallets: [
        paperEmbeddedWalletRainbowKitConnector({
          chains,
          options: {
            clientId: "992d8417-9cd1-443c-bae3-f9eac1d64767",
            chain: "Polygon",
          },
        }),
      ],
    },
    {
      groupName: "Log In With Wallet",
      wallets: [
        metaMaskWallet({ chains }),
        walletConnectWallet({ chains }),
        coinbaseWallet({ appName: "Paper", chains }),
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
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={lightTheme({
          borderRadius: "small",
          fontStack: "system",
        })}
      >
        <Flex
          border="1px solid grey"
          h="xs"
          w="md"
          mx="auto"
          rounded="lg"
          align="center"
          justify="center"
          bg="white"
          mt="10%"
        >
          <style>{`
						[data-rk] [aria-labelledby="rk_connect_title"] {
							z-index: 2147483645 !important;
						}
					`}</style>

          <ConnectButton />
        </Flex>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
export default TestPage;
