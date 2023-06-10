---
"@paperxyz/embedded-wallet-service-sdk": minor
---

feat(embedded-wallet-service-sdk): Add ability to generate wallet with no user recovery code required

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
  }
});
```
