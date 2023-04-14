<p align="center">
    <br />
    <a href="https://withpaper.com"><img src="./assets/paper-logo.svg" width="100" alt=""/></a>
    <br />
</p>
<h1 align="center">Paper Embedded Wallet Service - Connect Wallet</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/@paperxyz/embedded-wallet-service-rainbowkit"><img src="https://img.shields.io/npm/v/@paperxyz/embedded-wallet-service-rainbowkit" alt="npm version"/></a>
    <a href="https://discord.gg/mnUa29J2Fp"><img alt="Join our Discord!" src="https://img.shields.io/discord/936354866358546453.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>
</p>

[Paper](https://withpaper.com) is a developer platform for NFT commerce that
easily onboards users without a wallet or cryptocurrency.

## [Documentation](https://docs.paper.xyz/docs/embedded-wallets-service-overview)

## Installation

Install **embedded-wallet-service-rainbowkit** and peer dependencies ([wagmi](https://wagmi.sh/react) and [ethers](https://docs.ethers.org/v5/)):

```shell
npm install @paperxyz/embedded-wallet-service-rainbowkit wagmi ethers@^5
yarn add @paperxyz/embedded-wallet-service-rainbowkit wagmi ethers@^5
```

Wrap your application with the provider:

```typescript
function App() {
  return (
    // Wrap your application.
    <PaperEmbeddedWalletProvider
      appName="Paper RainbowKit Provider Example"
      walletOptions={{
        clientId: "992d8417-9cd1-443c-bae3-f9eac1d64767",
        chain: "Polygon",
      }}
    >
      // ...your app // Add the connect button anywhere in your app. // Make
      sure it's wrapped within `PaperEmbeddedWalletProvider`.
      <ConnectButton />
    </PaperEmbeddedWalletProvider>
  );
}
```

## Customize the button

Pass your own button to match your app's branding. Here's an example with [Chakra UI](https://chakra-ui.com/).

```typescript
<ConnectButton>
  <Button size="lg" rounded="full">
    Sign In
  </Button>
</ConnectButton>
```

## Customize the modal

The RainbowKit modal is highly customizable and `modalOptions` supports all `<RainbowKitProvider>` props. See [RainbowKit's theme guide](https://www.rainbowkit.com/docs/theming) for the full list of options.

Here's an example of a few customizations:

```typescript
import { darkTheme } from "@paperxyz/embedded-wallet-service-rainbowkit";

<PaperEmbeddedWalletProvider
  modalOptions={{
    modalSize: "wide",
    theme: darkTheme({
      accentColor: "#7b3fe4",
      accentColorForeground: "white",
      borderRadius: "small",
      fontStack: "system",
      overlayBlur: "small",
    }),
  }}
>
  // ...
</PaperEmbeddedWalletProvider>;
```
