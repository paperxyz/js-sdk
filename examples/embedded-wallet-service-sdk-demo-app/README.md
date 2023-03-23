# Welcome to Paper's Embedded Wallet Service (EWS) Demo App

Feel free to play around with a live deployment of this sample app [here](https://ews-demo.withpaper.com)

Find the docs with more information [here](https://ews.withpaper.com/docs)

## Using this example

Run the following command:

```bash
npx degit paperxyz/js-sdk/examples/embedded-wallet-service-sdk-demo-app paper-embedded-wallet-service-demo-app
cd paper-embedded-wallet-service-demo-app
yarn install
ts-node ./scripts/prepareEnvironment.mjs
git init . && git add . && git commit -m "Init"
yarn dev
```

<img width="770" alt="image" src="https://user-images.githubusercontent.com/44563205/213288511-8b325764-4f78-4cda-b40a-ddbf1395aeb3.png">

Logging in with email address is using the `<Login>` component and sends a unique 6-digit code from Paper to the email given in the input. Upon verification, the user is then prompted to enter a security password and download an 8-word secret recovery phrase to reset the password in the event that the password is lost or forgotten. The user will be prompted to enter this password every time they log in using a new device.

After the initial setup, the following page will be rendered. On this page, you can sign a message, sign a transaction, call the custom gasless contract method (which airdrops an NFT to the wallet), and log out of your wallet.

<img width="775" alt="image" src="https://user-images.githubusercontent.com/44563205/210889154-eeb4ce92-f20f-494f-a35f-f043388eb3ff.png">
