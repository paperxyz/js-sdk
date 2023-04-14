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
      <PaperEmbeddedWalletConnectButton>
        <button
          style={{
            padding: "10px",
            border: "2px solid white",
          }}
        >
          Enter Philtopia
        </button>
      </PaperEmbeddedWalletConnectButton>
    </PaperEmbeddedWalletProvider>
  );
};
export default ProviderDemo;
