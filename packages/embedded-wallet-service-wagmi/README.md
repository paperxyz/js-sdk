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

## [Documentation](https://docs.paper.xyz/docs/embedded-wallets-service-overview)

## Installation

Install this SDK:

```shell
npm install @paperxyz/embedded-wallet-service-wagmi
yarn add @paperxyz/embedded-wallet-service-wagmi
pnpm add @paperxyz/embedded-wallet-service-wagmi
```

Add the connector:

```typescript
import { createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains([mainnet], [publicProvider()]);

const client = createClient({
  connectors: [
    new PaperEmbeddedWalletWagmiConnector({
      chains,
      // options: { ... }
    }),
  ],
  provider,
});
```

See [Wagmi - Getting Started](https://wagmi.sh/react) for more help.

## Arguments

### chains

The list of chains your application may use.

### options

The argument passed into the `PaperEmbeddedWalletSdk` constructor. See [PaperEmbeddedWalletSdk](https://docs.withpaper.com/docs/embedded-wallet-service-sdk-reference#paperembeddedwalletsdk).
