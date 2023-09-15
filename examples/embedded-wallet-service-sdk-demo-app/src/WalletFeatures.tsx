import {
  Button,
  Card,
  CardBody,
  Code,
  Divider,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from "@chakra-ui/react";
import {
  ContractCallInputType,
  InitializedUser,
} from "@paperxyz/embedded-wallet-service-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

interface Props {
  user: InitializedUser | undefined;
}

enum Features {
  GET_WALLET = "GET_WALLET",
  SIGN_MESSAGE = "SIGN_MESSAGE",
  SIGN_TYPED_DATA = "SIGN_TYPED_DATA",
  SIGN_T_ETH = "SIGN_T_ETH",
  SIGN_T_GOERLI = "SIGN_T_GOERLI",
  CALL_GASLESS_CONTRACT = "CALL_GASLESS_CONTRACT",
  SEND_NATIVE_TOKEN = "SEND_NATIVE_TOKEN",
  FETCH_BALANCE = "FETCH_BALANCE",
}

const PLACEHOLDER = "The result will appear here";

export const WalletFeatures: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState<Features | null>(null);
  const [result, setResult] = useState<any>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const wallet = user?.wallet;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onResult = (result: any) => {
    setResult((prevState: any) => ({
      ...(prevState || {}),
      ...result,
    }));
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

  const fetchBalance = async () => {
    setLoading(Features.FETCH_BALANCE);
    try {
      const signer = await wallet?.getEthersJsSigner();

      if (!signer) {
        throw new Error("Wallet not connected");
      }

      const balanceWei = await signer.getBalance();

      // Let's add some debugging here:
      console.log('Fetched balance in Wei:', balanceWei.toString());

      const balanceEth = ethers.utils.formatEther(balanceWei);
      console.log('Converted balance in ETH:', balanceEth);

      setBalance(balanceEth);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching balance:", error.message);
      } else {
        console.error("An unknown error occurred while fetching balance");
      }
    } finally {
      setLoading(null);
    }
  };


  useEffect(() => {
    if (user?.wallet) {
      fetchBalance();
    }
  }, [user?.wallet]);



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

  const sendNativeToken = async () => {
    setLoading(Features.SEND_NATIVE_TOKEN);
    try {
      const signer = await wallet?.getEthersJsSigner();
      if (!signer) {
        throw new Error("Wallet not connected");
      }

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount)
      });

      setTxStatus(`Transaction hash: ${tx.hash}`);
      await tx.wait();
      setTxStatus(`Transaction ${tx.hash} has been confirmed`);
    } catch (error) {
      if (typeof error === 'string') {
        console.error("Error sending native token:", error);
        setTxStatus(`Error: ${error}`);
      } else if (error instanceof Error) {
        console.error("Error sending native token:", error.message);
        setTxStatus(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred while sending native token");
        setTxStatus(`An unknown error occurred`);
      }
    } finally {
      setLoading(null);
    }
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
    <Card bg="white" borderRadius={8} boxShadow="lg" p={6}>
      <CardBody>
        <Heading size="lg" color="black" mb={6}>Wallet Features</Heading>
        <Divider my={4} borderColor="gray.300" />
        <Stack spacing={6}>
          <Section title="Native Token Balance">
            <Button
              onClick={fetchBalance}
              colorScheme="blue"
              isLoading={loading === Features.FETCH_BALANCE}
            >
              Fetch Balance
            </Button>
            <Text fontSize="xl" color="black">{balance ? `${balance} MATIC` : "Balance not fetched"}</Text>
          </Section>

          <Section title="Wallet Address">
            <Button
              onClick={getAddress}
              colorScheme="blue"
              isLoading={loading === Features.GET_WALLET}
            >
              Get Wallet Address
            </Button>
            <LinkDisplay value={result?.wallet} urlBase="https://mumbai.polygonscan.com/address/" />
          </Section>

          <Section title="Transfer Native Token">
            <Input
              color="black"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
              mt={2}
              color="black"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              mt={2}
              onClick={sendNativeToken}
              colorScheme="blue"
              isLoading={loading === Features.SEND_NATIVE_TOKEN}
            >
              Send
            </Button>
            <Text mt={2} fontSize="md" color="black">{txStatus}</Text>
          </Section>

          <Section title="Sign Message">
            <Button
              onClick={signMessage}
              colorScheme="blue"
              isLoading={loading === Features.SIGN_MESSAGE}
            >
              Sign Message
            </Button>
            <CodeDisplay value={result?.signedMessage} />
          </Section>

          <Section title="Sign Typed Data (EIP712)">
            <Button
              onClick={signTypedDataV4}
              colorScheme="blue"
              isLoading={loading === Features.SIGN_TYPED_DATA}
            >
              Sign Typed Data
            </Button>
            <CodeDisplay value={result?.signedTypedData} />
          </Section>

          <Section title="Call Gasless Contract Method">
            <Button
              onClick={callContractGasless}
              colorScheme="blue"
              isLoading={loading === Features.CALL_GASLESS_CONTRACT}
            >
              Call Gasless Contract
            </Button>
            <LinkDisplay value={result?.gaslessTransactionHash} urlBase="https://mumbai.polygonscan.com/tx/" />
          </Section>

          <Section title="Export Private Key">

            <Button onClick={onOpen} colorScheme="blue" mt={4}>
              Export Account
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Export Account</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <iframe
                    src='https://withpaper.com/sdk/2022-08-12/embedded-wallet/export?clientId=8e0e99fe-933e-4ff8-a2f7-5c7439196c15'
                    width="525px"
                    height="475px"
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Section>

        </Stack>
      </CardBody>
    </Card>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <Stack spacing={4} borderWidth="1px" borderRadius="8px" p={4} borderColor="gray.300">
    <Heading size="md" color="black">{title}</Heading>
    <Divider borderColor="gray.300" />
    {children}
  </Stack>
);

interface CodeDisplayProps {
  value?: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ value }) => (
  <Code borderRadius={8} p={4} width="full">
    {value || "No data available"}
  </Code>
);

interface LinkDisplayProps {
  value?: string;
  urlBase: string;
}

const LinkDisplay: React.FC<LinkDisplayProps> = ({ value, urlBase }) => (
  <Code borderRadius={8} p={4} width="full">
    {value ? (
      <Link
        isExternal
        textDecoration="underline"
        href={`${urlBase}${value}`}
      >
        {value}
      </Link>
    ) : (
      "No data available"
    )}
  </Code>
);