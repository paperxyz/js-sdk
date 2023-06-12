import {
  ConnectButton,
  PaperEmbeddedWalletProvider,
} from "@paperxyz/embedded-wallet-service-rainbowkit";
import { darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import { Chain } from "@paperxyz/sdk-common-utilities";
import { useNetwork, useSwitchNetwork } from "wagmi";

const ProviderDemo = () => {

  // const [chain, setChain] = useState<Chain>("Polygon");

  // const switchNetwork = () => {
  //   if (chain === "Polygon") {
  //     setChain("Ethereum");
  //   } else {
  //     setChain("Polygon");
  //   }
  // }

  return (
  <PaperEmbeddedWalletProvider
      appName="Paper x RainbowKit Demo"
      walletOptions={{
        clientId: "2158909f-05b2-47f9-8658-ca3ca6fd8797",
        chains: ['Polygon','Ethereum'],
        name: "Acme Inc.",
        iconUrl: "https://withpaper.com/icons/paper-embedded-wallet-black.png",
        iconBackground: "#fc03e3",
        rpcEndpoint: "https://polygon.rpc.thirdweb.com",
        
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
        <MyComponent />
      </div>
    </PaperEmbeddedWalletProvider>
  );
};
export default ProviderDemo;

const MyComponent = () => {
  const [chainId, setChainId] = useState<number>(137);
  const { chain, chains } = useNetwork();

  const { error, isLoading, pendingChainId, switchNetwork } =
  useSwitchNetwork();

  return (
    <div>
          <>
      {chain && <div>Connected to {chain.name}</div>}
 
      {chains.map((x) => (
        <button
          disabled={!switchNetwork || x.id === chain?.id}
          key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          {x.name}
          {isLoading && pendingChainId === x.id && ' (switching)'}
        </button>
      ))}
 
      <div>{error && error.message}</div>
    </>
      <button  style={{ backgroundColor:"gray" }} onClick={() => {
        console.log('switchNetwork:', switchNetwork)
        console.log('chainId:', chainId)
        console.log('chains:', chains)
        if (switchNetwork) {
          console.log("switched");
          switchNetwork(chainId === 137 ? 1 : 137);
        }
        
        setChainId(chainId === 137 ? 1 : 137);
      }}>SWITCH NETWORK</button>
    </div>
  )
}
