<p align="center">
    <br />
    <a href="https://withpaper.com"><img src="./assets/paper-logo.svg" width="100" alt=""/></a>
    <br />
</p>
<h1 align="center">Paper Embedded Wallet Service - RainbowKit Wallet</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/@paperxyz/embedded-wallet-service-rainbowkit"><img src="https://img.shields.io/npm/v/@paperxyz/embedded-wallet-service-rainbowkit" alt="npm version"/></a>
    <a href="https://discord.gg/mnUa29J2Fp"><img alt="Join our Discord!" src="https://img.shields.io/discord/936354866358546453.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>
</p>

[Paper](https://withpaper.com) is a developer platform for NFT commerce that
easily onboards users without a wallet or cryptocurrency.

## [Documentation](https://docs.paper.xyz/docs/embedded-wallets-service-overview)

## Installation

Install this SDK:

```shell
npm install @paperxyz/embedded-wallet-service-rainbowkit
yarn add @paperxyz/embedded-wallet-service-rainbowkit
pnpm add @paperxyz/embedded-wallet-service-rainbowkit
```

Add the wallet to RainbowKit:

```typescript
const { chains, provider, webSocketProvider } = configureChains(
  [polygon],
  [publicProvider()],
);

const connectors = connectorsForWallets([
  {
    groupName: "Log In With Email",
    wallets: [
      PaperEmbeddedWalletRainbowKitWallet({
        chains,
        options: {
          clientId: "EWS_CLIENT_ID",
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
      coinbaseWallet({ appName: "Acme Inc.", chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

<WagmiConfig client={wagmiClient}>
  <RainbowKitProvider chains={chains}>
    <ConnectButton />
  </RainbowKitProvider>
</WagmiConfig>;
```

See [RainbowKit - Introduction](https://www.rainbowkit.com/docs) for more help.

NOTE: If the Embedded Wallet login modal appears behind RainbowKit modal, lower the z-index of the RainbowKit modal:

```css
[data-rk] [aria-labelledby="rk_connect_title"] {
  z-index: 2147483645 !important;
}
```

## Arguments

### name

The name of the wallet option on RainbowKit. Defaults to "Email".

### iconUrl

The icon to display next to the name.

### chain

The chain the wallet will be managed on.
Note: A user receives the same wallet address across all EVM chains, mainnet and testnet.

### options

The argument passed into the `PaperEmbeddedWalletSdk` constructor. See [PaperEmbeddedWalletSdk](https://docs.withpaper.com/docs/embedded-wallet-service-sdk-reference#paperembeddedwalletsdk).
