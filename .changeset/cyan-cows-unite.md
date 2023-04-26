---
"@paperxyz/react-client-sdk": patch
---

React provider is now deprecated. The recommended alternative is to pass props into components directly.

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
