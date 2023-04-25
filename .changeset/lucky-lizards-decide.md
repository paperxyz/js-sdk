---
"@paperxyz/embedded-wallet-service-sdk": major
---

BREAKING(`user.authDetails`): `email` is now optionally returned.
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
