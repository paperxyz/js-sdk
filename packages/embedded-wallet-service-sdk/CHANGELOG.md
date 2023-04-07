# @paperxyz/embedded-wallet-service-sdk

## 0.0.28

### Patch Changes

- e96f1e9: fix (iframeCommunicator): Use `string` for error messages through iframe instead of `Error` for better serialization support
- Updated dependencies [e96f1e9]
  - @paperxyz/sdk-common-utilities@0.0.2

## 0.0.27

### Patch Changes

- f0a7691: fix: logout existing user before starting login flows

  This prevents the odd case where you you can use any OTP to login to a user that is already logged in in the headless flow

- d39ec78: feat: add `recoveryCode` in `authDetails` on user login wherever possible

## 0.0.26

### Patch Changes

- a4bda22: BREAKING: `\_signTypedData` now matches ethers `\_signTypedData` function.

  Almost all developer should be unaffected by this change.

## 0.0.25

### Patch Changes

- d845d38: perf: make iframe calls more robust

## 0.0.24

### Patch Changes

- 8812469: feat: add support for eth_signTypedData_v4

## 0.0.23

### Patch Changes

- 16ab360: chore: update internal dependency

## 0.0.22

### Patch Changes

- f765a80: security: post messages are directed only to Paper's iframe

## 0.0.22

### Patch Changes

- 1a33395: security: post messages are directed only to Paper's iframe

## 0.0.20

### Patch Changes

- 53a17f8: perf: cache calls for load times speed up

## 0.0.19

### Patch Changes

- 4323447: feat: add `isNewDevice` to `sendPaperEmailLoginOtp` function
  Note that if you're asking the user for recovery code, checking for `isNewDevice === true` is now more accurate than checking for `!isNewUser === true` when deciding whether to ask for recovery code. In particular, some existing user (`!isNewUser`) will no longer be required to enter their recovery phrase again when logging back into an existing device.

  Passing in a `recoveryCode` even when `isNewDevice === false` will still work.

  feat: allow users logging in and out of same device to not require recovery phrase

  security: lock iframe post-messaging to paper domain

  internal: removed `AuthStoredTokenReturnType` type.
  remove unused `Modal.ts` and `UiCommunicator` files.

## 0.0.18

### Patch Changes

- 80ea5d7: feat: add `userWalletId` to user's `AuthDetails` type

## 0.0.17

### Patch Changes

- 4543071: feat: move ews to full non-custodial model
- bb3930a: docs: update inline docs to reflect current SDK interface

  types: Developer's can now always expect `email` to be returned in the `InitializedUser.authDetails` object

  BREAKING (internal): rename `storeCookieString` to `shouldStoreCookieString` in `AuthStoredTokenWithCookieReturnType`.

  BREAKING: remove `getAddress` function in `EmbeddedWallet`. Developer's already have access to user's wallet address from the `InitializedUser` object that is returned from the auth methods like `Paper.auth.loginWithPaperModal()`.

  BREAKING: `recoveryCode` param is now required in `loginWithHwtAuth` and `verifyPaperEmailLoginOtp` functions when the user is an existing user.

- af3a9d7: breaking: remove `success` from `sendPaperEmailLoginOtp` return type
- 7b3a663: BREAKING: rename the Chains type to Chain

## 0.0.16

### Patch Changes

- 35b6446: docs(headless email OTP auth): update documentation around headless auth for greater clarity
- e9349d2: feat(headless email OTP auth): add ability to support email OTP auth
  docs(headless email OTP auth): add code samples and function overview for headless auth
