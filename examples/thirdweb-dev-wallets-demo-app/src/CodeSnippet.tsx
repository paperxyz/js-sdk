import { Text } from "@chakra-ui/react";
import { GetUser, UserStatus } from "@thirdweb-dev/wallets";
import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const CodeSnippet = ({ userDetails }: { userDetails: GetUser }) => {
  let codeSnippet: string = "";
  if (userDetails.status === UserStatus.LOGGED_OUT) {
    codeSnippet = `
const embeddedWallet = new EmbeddedWalletSdk({
    clientId: "YOUR_CLIENT_ID",
    chain: "Mumbai"
})

// logging in via the Paper modal
const result = await embeddedWallet.auth.loginWithThirdwebModal()

// logging in via email OTP only
const result = await embeddedWallet.auth.loginWithThirdwebEmailOtp({
  email: "you@example.com"
})`;
  } else {
    codeSnippet = `
const embeddedWallet = new EmbeddedWalletSdk({
    clientId: "YOUR_CLIENT_ID",
    chain: "Goerli"
})
const user = await embeddedWallet.getUser();
if (user.status !== UserStatus.LOGGED_OUT) {
    const userThirdwebWallet = user.wallet;
    
    // do native web3 ethers.js stuff
    const ethersJsSigner = await userThirdwebWallet.getEthersJsSigner()
    ethersJsSigner.sendTransaction({ ... })
}`;
  }

  return (
    <>
      <Text fontWeight="bold" my={2}>
        thirrdweb EmbeddedWallet related code snippet:
      </Text>
      <SyntaxHighlighter language="typescript" style={tomorrow}>
        {codeSnippet}
      </SyntaxHighlighter>
    </>
  );
};
