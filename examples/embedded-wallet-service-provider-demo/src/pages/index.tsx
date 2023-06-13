import {
  ConnectButton,
  PaperEmbeddedWalletProvider,
} from "@paperxyz/embedded-wallet-service-rainbowkit";
import { darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const ProviderDemo = () => {
  return (
    <PaperEmbeddedWalletProvider
      appName="Paper x RainbowKit Demo"
      walletOptions={{
        clientId: "c1e1c50a-dde5-4411-83c6-7867ede4a3d5",
        chain: "Polygon",
        name: "Acme Inc.",
        iconUrl: "https://withpaper.com/icons/paper-embedded-wallet-black.png",
        iconBackground: "#fc03e3",
        rpcEndpoint: "https://polygon.rpc.thirdweb.com"
      }}
      supportedChains={["Polygon", "Ethereum"]}
      modalOptions={{
        theme: darkTheme({
          accentColor: "#7b3fe4",
          accentColorForeground: "white",
          borderRadius: "small",
          fontStack: "system",
          overlayBlur: "small",
        }),
      }}
    >
      <div style={{ padding: "150px" }}>
        <ConnectButton />
      </div>
    </PaperEmbeddedWalletProvider>
  );
};
export default ProviderDemo;