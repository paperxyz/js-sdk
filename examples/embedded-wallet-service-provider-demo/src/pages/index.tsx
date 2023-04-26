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
        clientId: "992d8417-9cd1-443c-bae3-f9eac1d64767",
        chain: "Polygon",
        name: "Acme Inc.",
        iconUrl: "https://withpaper.com/icons/paper-embedded-wallet-black.png",
        iconBackground: "#fc03e3",
      }}
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
