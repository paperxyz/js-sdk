# @paperxyz/react-client-sdk

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
