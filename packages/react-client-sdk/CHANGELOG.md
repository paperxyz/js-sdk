# @paperxyz/react-client-sdk

## 1.0.4

### Patch Changes

- 3f8dffc: iframe now takes 100% height (w/ minHeight)
- Updated dependencies [3f8dffc]
  - @paperxyz/js-client-sdk@0.2.2

## 1.0.3

### Patch Changes

- c20ac98: Bumping dependency version for paper packages

## 1.0.2

### Patch Changes

- 6030f9c: Added backendless checkout with card to react client and js sdk
- Updated dependencies [6030f9c]
  - @paperxyz/sdk-common-utilities@0.0.5

## 1.0.1

### Patch Changes

- Updated dependencies [5077a7c]
  - @paperxyz/sdk-common-utilities@0.0.4

## 1.0.0

### Major Changes

- 5186279: chore (react-client-sdk): Remove dependency on `wagmi` and `ethers` causing build errors

  BREAKING: `CheckoutWithEth` and `PayWithCrypto` is no longer available

  We have released an alternate package to grab if you want to keep using `CheckoutWithEth`. Install it via `npm i @paperxyz/react-client-sdk-checkout-with-eth`

## 0.9.3

### Patch Changes

- 797bc24: React provider is now deprecated. The recommended alternative is to pass props into components directly.

  **Before:**

  ```
  <PaperSDKProvider appName={...} chainName={...} clientId={...}>
    ...
    <CheckoutWithCard
      sdkClientSecret={...}
      onPaymentSuccess={...}
    />
    ...
  </PaperSDKProvider>
  ```

  **After**

  ```
  <CheckoutWithCard
    sdkClientSecret={...}
    onPaymentSuccess={...}
    appName={...}
  />
  ```

- ce293ab: hack(react-client-sdk): use `tsup-node` to prevent any dependency from being bundled

## 0.9.2

### Patch Changes

- 1caa827: Allow setting the RPC URL(s) for CheckoutWithEth

## 0.9.1

### Patch Changes

- 542ac25: Pin JS SDK dependencies
- Updated dependencies [7440c1b]
  - @paperxyz/sdk-common-utilities@0.0.3

## 0.9.0

### Minor Changes

- 3905283: Introduce 'onPriceUpdate' callback to CheckoutWithCard

### Patch Changes

- ad6096e: chore: update internal dependcy for react-client-sdk
- Updated dependencies [3905283]
  - @paperxyz/js-client-sdk@0.2.0
