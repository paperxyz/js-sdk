---
"@paperxyz/embedded-wallet-service-sdk": minor
---

feat(embedded-wallet-service-sdk): Add ability to generate wallet with no user recovery code required

```typescript
// To opt into the recovery code free flow
// This flow leverages AWS key management store that live in hardware security module to safely store the user's recovery share.
// ! You will not be able to opt back into the old AuthType.USER_MANAGED flow once changing over at this point in time
const paperSdk = new PaperEmbeddedWalletSdk({
  clientId: "",
  chain: "Goerli",
  auth: {
    type: AuthType,
    AWS_MANAGED,
  },
});
```

feat(embedded-wallet-service-sdk): Add ability to override the recovery code for new user rather than using Paper's pre-generated recovery codes.
Note: By overriding the recovery code generation, user's will not be able to user the `withpaper.com/wallet` page anymore

```

```
