import { Text } from "@chakra-ui/react";
import { GetUser, UserStatus } from "@paperxyz/embedded-wallet-service-sdk";
import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const CodeSnippet = ({ userDetails }: { userDetails: GetUser }) => {
  let codeSnippet: string = "";
  if (userDetails.status === UserStatus.LOGGED_OUT) {
    codeSnippet = `
const Paper = new PaperEmbeddedWalletSdk({
    clientId: "YOUR_CLIENT_ID",
    chain: "Mumbai"
})

// logging in via the Paper modal
const result = await Paper.auth.loginWithPaperModal()

// logging in via email OTP only
const result = await Paper.auth.loginWithPaperEmailOtp({
  email: "you@example.com"
})`;
  } else {
    codeSnippet = `
const Paper = new PaperEmbeddedWalletSdk({
    clientId: "YOUR_CLIENT_ID",
    chain: "Goerli"
})
const user = await Paper.getUser();
if (user.status !== UserStatus.LOGGED_OUT) {
    const userPaperWallet = user.wallet;
    
    // send gasless transactions to claim an NFT on Goerli
    // Note: You need to top up Sponsored fees on the developer dashboard first
    const { transactionHash } = await userPaperWallet.gasless.callContract({
        contractAddress: "0xb2369209b4eb1e76a43fAd914B1d29f6508c8aae",
        methodArgs: [user.walletAddress, 1, 0],
        methodInterface:
          "function claimTo(address _to, uint256 _quantity, uint256 _tokenId) external",
      });

    // do native web3 ethers.js stuff
    const ethersJsSigner = await userPaperWallet.getEthersJsSigner()
    ethersJsSigner.sendTransaction({ ... })
}`;
  }

  return (
    <>
      <Text fontWeight="bold" my={2}>
        Paper related code snippet:
      </Text>
      <SyntaxHighlighter language="typescript" style={tomorrow}>
        {codeSnippet}
      </SyntaxHighlighter>
    </>
  );
};
