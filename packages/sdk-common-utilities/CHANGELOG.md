# @paperxyz/sdk-common-utilities

## 0.0.3

### Patch Changes

- 7440c1b: feat(embedded-wallet-service-sdk): Add ability to support any arbitrary evm chain via 'rpcEndpoint`override when calling`userwallet.getEthersJsSigner({ rpcEndpoint: "" })`

  chore(sdk-common-utilities): update public rpc endpoints to more generous ones

## 0.0.2

### Patch Changes

- e96f1e9: fix (iframeCommunicator): Use `string` for error messages through iframe instead of `Error` for better serialization support

## 0.0.1

### Patch Changes

- 825a36f: BREAKING: Migrate a bunch of internal types and constants from `js-client-sdk` to `sdk-common-utilities`.

  Affected Types and constants:

  - `DEFAULT_BRAND_OPTIONS`
  - `ICustomizationOptions`
  - `Locale`
  - `SupportedChainName`
