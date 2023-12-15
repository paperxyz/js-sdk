# @paperxyz/js-client-sdk

## 0.2.6

### Patch Changes

- f7c4e6d: added pointer-events to modal

## 0.2.5

### Patch Changes

- a0f15f6: fix: ICheckoutWithCard mintMethod.args is now an object type (previously array)

## 0.2.4

### Patch Changes

- 44c7aed: Made CheckoutWithEth backendless and standardized the callback interfaces between the CheckoutWithEth and CheckoutWithCard sdks

## 0.2.3

### Patch Changes

- aa0f749: fix: don't crash if configs or sdkClientSecret isn't passed to the checkout-with-card component

## 0.2.2

### Patch Changes

- 3f8dffc: iframe now takes 100% height (w/ minHeight)

## 0.2.1

### Patch Changes

- 49c544e: Backendless flow for CheckoutWithCard

## 0.2.0

### Minor Changes

- 3905283: Introduce 'onPriceUpdate' callback to CheckoutWithCard

## 0.1.0

### Minor Changes

- 825a36f: BREAKING: Migrate a bunch of internal types and constants from `js-client-sdk` to `sdk-common-utilities`.

  Affected Types and constants:

  - `DEFAULT_BRAND_OPTIONS`
  - `ICustomizationOptions`
  - `Locale`
  - `SupportedChainName`

### Patch Changes

- Updated dependencies [825a36f]
  - @paperxyz/sdk-common-utilities@0.0.1
