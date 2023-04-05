---
"@paperxyz/embedded-wallet-service-sdk": patch
---

fix: logout existing user before starting login flows

This prevents the odd case where you you can use any OTP to login to a user that is already logged in in the headless flow