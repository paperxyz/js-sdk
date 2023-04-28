import {
  Button,
  Card,
  CardBody,
  Code,
  Divider,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  ContractCallInputType,
  InitializedUser,
} from "@paperxyz/embedded-wallet-service-sdk";
import { useState } from "react";

interface Props {
  user: InitializedUser | undefined;
}

enum Features {
  REVEAL_PRIVATE_KEY = "REVEAL_PRIVATE_KEY",
  GET_WALLET = "GET_WALLET",
  SIGN_MESSAGE = "SIGN_MESSAGE",
  SIGN_TYPED_DATA = "SIGN_TYPED_DATA",
  SIGN_T_ETH = "SIGN_T_ETH",
  SIGN_T_GOERLI = "SIGN_T_GOERLI",
  CALL_GASLESS_CONTRACT = "CALL_GASLESS_CONTRACT",
}

const PLACEHOLDER = "The result will appear here";

export const WalletFeatures: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState<Features | null>(null);
  const [result, setResult] = useState<any>(null);
  const wallet = user?.wallet;
  const onResult = (result: any) => {
    setResult((prevState: any) => ({
      ...(prevState || {}),
      ...result,
    }));
  };

  const revealPrivateKey = async () => {
    try {
      setLoading(Features.REVEAL_PRIVATE_KEY);
      await wallet?.exportPrivateKey();
    } finally {
      setLoading(null);
    }
  };
  const getAddress = async () => {
    setLoading(Features.GET_WALLET);
    const signer = await wallet?.getEthersJsSigner();
    const address = await signer?.getAddress();
    setLoading(null);
    onResult({
      wallet: address,
    });
    console.log("address", address);
  };

  const signMessage = async () => {
    setLoading(Features.SIGN_MESSAGE);
    // You can override the RPC url to whatever endpoint you need
    const signer = await wallet?.getEthersJsSigner({
      rpcEndpoint: "https://bsc.blockpi.network/v1/rpc/public",
    });
    console.log("await signer?.getChainId()", await signer?.getChainId());
    const signedMessage = await signer?.signMessage("hello world");
    onResult({
      signedMessage,
    });
    setLoading(null);
    console.log("signedMessage", signedMessage);
  };

  const signTypedDataV4 = async () => {
    setLoading(Features.SIGN_TYPED_DATA);
    // You can override the RPC url to whatever endpoint you need
    const signer = await wallet?.getEthersJsSigner({
      rpcEndpoint: "https://eth.llamarpc.com",
    });
    const signedTypedData = await signer?._signTypedData(
      {
        version: "1.0.0",
        name: "Paper Embedded wallet demo",
        chainId: 1,
      },
      {
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" },
        ],
      },
      {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: "Hello, Bob!",
      },
    );
    setLoading(null);

    onResult({
      signedTypedData,
    });
  };

  const callContractGasless = async () => {
    setLoading(Features.CALL_GASLESS_CONTRACT);
    const params = {
      contractAddress: "0xb2369209b4eb1e76a43fAd914B1d29f6508c8aae",
      methodArgs: [user?.walletAddress ?? "", 1, 0],
      methodInterface:
        "function claimTo(address _to, uint256 _quantity, uint256 _tokenId) external",
    } as ContractCallInputType;
    console.log("params", params);
    try {
      const result = await user?.wallet.gasless.callContract(params);
      console.log("transactionHash", result?.transactionHash);
      onResult({
        gaslessTransactionHash: result?.transactionHash,
      });
    } catch (e) {
      console.error(`something went wrong sending gasless transaction ${e}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card bg="white" borderRadius={8}>
      <CardBody>
        <Heading size="md">Wallet Features</Heading>
        <Divider my={4} />
        <Stack spacing={4} divider={<Divider />}>
          <Stack>
            <Button
              onClick={revealPrivateKey}
              colorScheme="blue"
              isLoading={loading === Features.REVEAL_PRIVATE_KEY}
            >
              Reveal Private Key
            </Button>
            <Button
              onClick={getAddress}
              colorScheme="blue"
              isLoading={loading === Features.GET_WALLET}
            >
              Get Wallet Address
            </Button>
            <Code borderRadius={8} p={4}>
              {result?.wallet ? (
                <Link
                  isExternal
                  textDecoration="underline"
                  href={`https://mumbai.polygonscan.com/address/${result.wallet}`}
                >
                  {result.wallet}
                </Link>
              ) : (
                <Text color="gray.500" fontStyle="italic" size="sm">
                  {PLACEHOLDER}
                </Text>
              )}
            </Code>
          </Stack>
          <Stack>
            <Button
              onClick={signMessage}
              colorScheme="blue"
              isLoading={loading === Features.SIGN_MESSAGE}
            >
              Sign Message
            </Button>
            <Code borderRadius={8} p={4} width="full">
              {result?.signedMessage || (
                <Text color="gray.500" fontStyle="italic" size="sm">
                  {PLACEHOLDER}
                </Text>
              )}
            </Code>
          </Stack>
          <Stack>
            <Button
              onClick={signTypedDataV4}
              colorScheme="blue"
              isLoading={loading === Features.SIGN_TYPED_DATA}
            >
              Sign Type Data (EIP712)
            </Button>
            <Code borderRadius={8} p={4} width="full">
              {result?.signedTypedData || (
                <Text color="gray.500" fontStyle="italic" size="sm">
                  {PLACEHOLDER}
                </Text>
              )}
            </Code>
          </Stack>
          <Stack>
            <Button
              onClick={callContractGasless}
              colorScheme="blue"
              isLoading={loading === Features.CALL_GASLESS_CONTRACT}
            >
              Call contract method (Gasless)
            </Button>
            <Code borderRadius={8} p={4} width="full">
              {result?.gaslessTransactionHash ? (
                <Link
                  isExternal
                  textDecoration="underline"
                  href={`https://mumbai.polygonscan.com/tx/${result.gaslessTransactionHash}`}
                >
                  {result.gaslessTransactionHash}
                </Link>
              ) : (
                <Text color="gray.500" fontStyle="italic" size="sm">
                  {PLACEHOLDER}
                </Text>
              )}
            </Code>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};
