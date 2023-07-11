---
"@paperxyz/embedded-wallet-service-sdk": major
---

feat(embedded-wallet-service): Move `recoveryShareManagement` to a global backend setting

This introduces a couple of breaking changes:

- `RecoveryShareManagement.AWS_MANGED` is now `recoveryShareManagement.KMS_MANAGED` to be more pedantic accurate
- `AdvancedOptions` is no longer a setting when instantiating the `PaperEmbeddedWalletSdk`
  - All Embedded Wallet Service clients on `USER_MANAGED` flow is will now default to that
  - All Embedded Wallet Service clients on `AWS_MANAGED` flow is will now default to that
  - If you are using the `recoveryShareManagement.AWS_MANAGED` flow, you no longer have to pass the `recoveryShareManagement.AWS_MANAGED` generic when typing the `PaperEmbeddedWalletSdk`

Net new changes to the SDK:

- Upon sign in, `user.authDetails` now have a `recoveryShareManagement` attribute
- Upon calling `sendPaperEmailLoginOtp`, we now return the `recoveryShareManagement` attribute as well so that developers can upgrade to the `KMS_MANAGED` flow if they wish while maintaining backwards compatibility. This is only useful if you use `sendPaperEmailLoginOtp`
