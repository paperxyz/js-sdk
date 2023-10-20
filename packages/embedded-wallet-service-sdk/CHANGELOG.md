# @paperxyz/embedded-wallet-service-sdk

## 1.2.5

### Patch Changes

- 71b3fb4: add auth Success callback

## 1.2.4

### Patch Changes

- c46e6d7: fix(embedded-wallet-service-sdk): update headless email flow to return information about user's login type to enable migration from USER_MANAGED to AWS_MANAGED

## 1.2.3

### Patch Changes

- 1f79975: chore(embedded-wallet-service-sdk): update loginWithGoogle to route through preLogin

## 1.2.2

### Patch Changes

- f0cbbe1: chore(embedded-wallet-service-sdk): update `loginWithGoogle` on for AWS login to be on feature parity with EmbeddedWalletSdk

## 1.2.1

### Patch Changes

- c33c406: feat(ews): spped up headless google auth

## 1.2.0

### Minor Changes

- 6393832: feat(embedded-wallet-service-sdk): add headless google oauth flow for AWS_MANAGED auth flow

## 1.1.3

### Patch Changes

- 7ae2200: Bumped all @paperxyz/_ packages to be the latest version (_) and updated the react-client-sdk-checkout-with-eth version label in the dom"
- 7ae2200: chore: updated all paper packages to use latest versions of paper package dependencies"
- 7ae2200: chore: bump sdk-common-utilities in embedded-wallet-service-sdk

## 1.1.2

### Patch Changes

- Updated dependencies [cec4455]
- Updated dependencies [cec4455]
  - @paperxyz/sdk-common-utilities@0.1.0

## 1.1.1

### Patch Changes

- e4d003f: chore(embedded-wallet-service-sdk): release new internal constant

## 1.1.0

### Minor Changes

- 416996e: feat(embedded-wallet-service-sdk): Add ability to generate wallet with no user recovery code required

  ```typescript
  // To opt into the recovery code free flow
  // This flow leverages AWS key management store that live in hardware security module to safely store the user's recovery share.
  // ! You will not be able to opt back into the old RecoveryShareManagement.USER_MANAGED flow once changing over at this point in time. We plan to enable switching back and forth in due time
  const paperSdk = new PaperEmbeddedWalletSdk({
    clientId: "YOUR_CLIENT_ID",
    chain: "Goerli",
    advancedOptions: {
      recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED,
    },
  });
  ```

  feat(embedded-wallet-service-sdk): Add ability to override the recovery code for new user rather than using Paper's pre-generated recovery codes.
  Note: By overriding the recovery code generation, user's will not be able to user the `https://withpaper.com/wallet` page anymore

  ```typescript
  const paperSdk = new PaperEmbeddedWalletSdk({
    clientId: "YOUR_CLIENT_ID",
    chain: "Goerli",
    advancedOptions: {
      recoveryShareManagement: RecoveryShareManagement.USER_MANAGED,
    },
  });

  const user = await paperSdk.auth.loginWithPaperModal({
    async getRecoveryCode(userWalletId) {
      // either fetch or generate a new recovery code for userWalletId
    },
  });
  ```

## 1.0.1

### Patch Changes

- 6030f9c: Added backendless checkout with card to react client and js sdk
- Updated dependencies [6030f9c]
  - @paperxyz/sdk-common-utilities@0.0.5

## 1.0.0

### Major Changes

- 217c117: BREAKING(`user.authDetails`): `email` is now optionally returned.
  All existing auth methods should continue to always return emails. This is to set up for future auth methods not based on emails.

  Resolution:

  ```typescript
  // Before
  const user = await paper.auth.loginWithPaperModal();
  user.authDetails.email; // string

  // After
  const user = await paper.auth.loginWithPaperModal();
  user.authDetails.email; // string | undefined
  ```

  feat(recovery-code free): Add ability for developers to inject recovery code in the regular `loginWithPaperModal` method.

  Usage:

  ```typescript
  await paper.auth.loginWithPaperModal({
    getRecoveryCode: async (userWalletId: string) => {
      // grab recoveryCode for `userWalletId` here.
      const recoveryCode = "";
      return recoveryCode;
    },
  });
  ```

## 0.2.0

### Minor Changes

- 7440c1b: feat(embedded-wallet-service-sdk): Add ability to support any arbitrary evm chain via 'rpcEndpoint`override when calling`userwallet.getEthersJsSigner({ rpcEndpoint: "" })`

  chore(sdk-common-utilities): update public rpc endpoints to more generous ones

### Patch Changes

- Updated dependencies [7440c1b]
  - @paperxyz/sdk-common-utilities@0.0.3

## 0.1.0

### Minor Changes

- 5936f4c: feat(embedded-wallet-service-sdk): Add ability to remove the asking of recovery code from users in the `loginWithPaperEmailOtp` flow

  style(eslint-config-paperxyz): prevent using of promises in conditional

### Patch Changes

- e20f644: security(EmbeddedWalletIframeCommunicator): set `clientId` after user set query params when creating iframe link

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
