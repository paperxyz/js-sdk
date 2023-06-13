import {
  ConnectButton,
  PaperEmbeddedWalletProvider,
} from "@paperxyz/embedded-wallet-service-rainbowkit";
import { darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";

const ProviderDemo = () => {
  return (
    <PaperEmbeddedWalletProvider
      appName="Paper x RainbowKit Demo"
      walletOptions={{
        clientId: "2158909f-05b2-47f9-8658-ca3ca6fd8797",
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
        <MyComponent />
      </div>
    </PaperEmbeddedWalletProvider>
  );
};
export default ProviderDemo;

const MyComponent = () => {
  // Demo will start with Polygon chain by default
  const [currentChainId, setCurrentChainId] = useState<number>(137);
  const { chain } = useNetwork();
  const { error, switchNetwork } =
    useSwitchNetwork();

  return (
    <div>
      <>
        <div>{error && error.message}</div>
        <div>{"The current chain is: "+chain?.name+" with chain id: "+currentChainId}</div>
      </>
      <button
        style={{ backgroundColor: "gray" }}
        onClick={() => {
          if (switchNetwork) {
            console.log("switched");
            switchNetwork(currentChainId === 137 ? 1 : 137);
            setCurrentChainId(currentChainId === 137 ? 1 : 137);
          }
        }}
      >
        SWITCH NETWORK
      </button>
    </div>
  );
};
