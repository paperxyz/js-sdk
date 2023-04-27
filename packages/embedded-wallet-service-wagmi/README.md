<p align="center">
    <br />
    <a href="https://withpaper.com"><img src="./assets/paper-logo.svg" width="100" alt=""/></a>
    <br />
</p>
<h1 align="center">Paper Embedded Wallet Service - Wagmi Connector</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/@paperxyz/embedded-wallet-service-wagmi"><img src="https://img.shields.io/npm/v/@paperxyz/embedded-wallet-service-wagmi" alt="npm version"/></a>
    <a href="https://discord.gg/mnUa29J2Fp"><img alt="Join our Discord!" src="https://img.shields.io/discord/936354866358546453.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>
</p>

[Paper](https://withpaper.com) is a developer platform for NFT commerce that
easily onboards users without a wallet or cryptocurrency.

## [Documentation](https://docs.withpaper.com/reference/embedded-wallet-service-overview)

## Installation

Install **embedded-wallet-service-wagmi** and peer dependencies ([wagmi](https://wagmi.sh/react) and [ethers](https://docs.ethers.org/v5/)):

```shell
npm install @paperxyz/embedded-wallet-service-wagmi wagmi ethers@^5
yarn add @paperxyz/embedded-wallet-service-wagmi wagmi ethers@^5
```

Add the Embedded Wallet connector to wagmi:

```typescript
import { createClient, configureChains } from "wagmi";
import { polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains([polygon], [publicProvider()]);

// Create a Wagmi-compatible connector for Paper Embedded Wallet.
const paperEmbeddedWallet = new PaperEmbeddedWalletWagmiConnector({
  chains,
  options: {
    chain: "Polygon",
    clientId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  },
});

const client = createClient({
  connectors: [paperEmbeddedWallet],
  provider,
});

// Wrap your application with WagmiConfig.
function App() {
  return <WagmiConfig client={client}>/** ...your app */</WagmiConfig>;
}
```

## Arguments

### chains

The list of chains your application may use.

### options

The argument passed into the `PaperEmbeddedWalletSdk` constructor. See [PaperEmbeddedWalletSdk](https://docs.withpaper.com/reference/embedded-wallet-service-sdk-reference#paperembeddedwalletsdk).
