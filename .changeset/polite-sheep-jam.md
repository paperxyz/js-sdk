---
"@paperxyz/react-client-sdk": major
---

chore (react-client-sdk): Remove deprecated and unused components from react client sdk

BREAKING: Many previously deprecated components will no longer be offered.

The following is a list of all the components

1. PaperProvider: Simply pass the props like `appName` into the components directly
1. PayWithCard: Use CheckoutWithCard
1. CheckoutWithEth: use either a [shareable](https://docs.withpaper.com/reference/shareable-checkout-links) or [one-time](https://docs.withpaper.com/reference/one-time-checkout-links) checkout link. Disable all options except pay with Eth.
1. PayWithCrypto: Same as above

For the following components, use `@paperxyz/embedded-wallet-service-sdk`. Visit [the docs](https://docs.withpaper.com/reference/embedded-wallet-service-overview) to get started:

- CreateWallet
- LoginWithPaper
- VerifyOwnershipWithPaper
