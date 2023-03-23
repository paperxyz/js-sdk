import { Text } from "@chakra-ui/react";
import { GetUser } from "@paperxyz/embedded-wallet-service-sdk";
import SyntaxHighlighter from "react-syntax-highlighter";

import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const UserDetails = ({ userDetails }: { userDetails: GetUser }) => {
  return (
    <>
      <Text fontWeight="bold" mt={4} mb={2}>
        UserDetails:
      </Text>
      <SyntaxHighlighter language="typescript" style={tomorrow}>
        {JSON.stringify(userDetails, null, 2)}
      </SyntaxHighlighter>
    </>
  );
};
