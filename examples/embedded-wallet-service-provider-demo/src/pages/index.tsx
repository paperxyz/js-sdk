import {
  ConnectButton,
  PaperEmbeddedWalletProvider,
} from "@paperxyz/embedded-wallet-service-rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const ProviderDemo = () => {
  return (
    <PaperEmbeddedWalletProvider
      appName="Paper x RainbowKit Demo"
      walletOptions={{
        clientId: "992d8417-9cd1-443c-bae3-f9eac1d64767",
        chain: "Polygon",
      }}
    >
      <ConnectButton>
        <button
          style={{
            padding: "10px",
            border: "2px solid white",
          }}
        >
          Enter Philtopia
        </button>
      </ConnectButton>
    </PaperEmbeddedWalletProvider>
  );
};
export default ProviderDemo;
