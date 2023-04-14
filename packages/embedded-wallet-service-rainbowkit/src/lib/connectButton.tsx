import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectButton = ({ children }: { children: React.ReactNode }) => {
  return children ? (
    <RainbowKitConnectButton.Custom>
      {({ openConnectModal }) => (
        <div onClick={openConnectModal}>{children}</div>
      )}
    </RainbowKitConnectButton.Custom>
  ) : (
    <RainbowKitConnectButton />
  );
};
