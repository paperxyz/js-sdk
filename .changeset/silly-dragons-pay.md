---
"@paperxyz/react-client-sdk": major
---

chore (react-client-sdk): Remove dependency on `wagmi` and `ethers` causing build errors

BREAKING: `CheckoutWithEth` and `PayWithCrypto` is no longer available

The following is a list of all the components and how to keep offering the same functionality if you want to keep using it

1. `PayWithCard`: Use CheckoutWithCard
1. `CheckoutWithEth`: use either a [shareable](https://docs.withpaper.com/reference/shareable-checkout-links) or [one-time](https://docs.withpaper.com/reference/one-time-checkout-links) checkout link. Disable all options except pay with Eth.
