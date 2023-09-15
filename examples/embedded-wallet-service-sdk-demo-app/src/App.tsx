import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  GridItem,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  GetUser,
  PaperEmbeddedWalletSdk,
  RecoveryShareManagement,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import { useCallback, useEffect, useState } from "react";
import { CodeSnippet } from "./CodeSnippet";
import { Login } from "./Login";
import { WalletFeatures } from "./WalletFeatures";
import { WalletInfo } from "./WalletInfo";
import { UserDetails } from "./snippets/UserDetails";

function App() {
  const [paper, setPaper] = useState<PaperEmbeddedWalletSdk>();
  const [paperManaged, setPaperManaged] = useState<PaperEmbeddedWalletSdk<RecoveryShareManagement.AWS_MANAGED>>();
  const [userDetails, setUserDetails] = useState<GetUser>();

  const query = new URLSearchParams(window.location.search);
  const isAwsManaged = query.get("managed") === "true";

  useEffect(() => {
    const paper = new PaperEmbeddedWalletSdk({
      clientId: process.env.REACT_APP_PAPER_EMBEDDED_WALLET_CLIENT_ID!,
      chain: "Mumbai",
    });
    setPaper(paper);
    const paperManaged = new PaperEmbeddedWalletSdk({
      clientId: process.env.REACT_APP_PAPER_EMBEDDED_WALLET_CLIENT_ID!,
      chain: "Mumbai",
      advancedOptions   : {
        recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED,
      },
    });
    setPaperManaged(paperManaged);
  }, []);

  const fetchUserStatus = useCallback(async () => {
    if (!paper) {
      return;
    }

    console.log("grabbing paper user");
    const paperUser = await paper.getUser();
    console.log("paperUser", paperUser);

    setUserDetails(paperUser);
  }, [paper]);

  useEffect(() => {
    if (paper && fetchUserStatus) {
      fetchUserStatus();
    }
  }, [paper, fetchUserStatus]);

  const logout = async () => {
    const response = await paper?.auth.logout();
    console.log("logout response", response);
    await fetchUserStatus();
  };

  let BodyComponent: JSX.Element;
  if (!userDetails) {
    BodyComponent = (
      <Center height="full">
        <Spinner size="md" color="white" />
      </Center>
    );
  } else if (userDetails.status === UserStatus.LOGGED_OUT) {
    BodyComponent = (
      <Login
        paper={isAwsManaged ? paperManaged : paper}
        isAwsManaged={isAwsManaged}
        onLoginSuccess={fetchUserStatus}
      />
    );
  } else {
    BodyComponent = (
      <Stack spacing={10}>
        <WalletInfo
          email={userDetails.authDetails.email}
          walletAddress={userDetails.walletAddress}
        />
        <WalletFeatures
          user={
            userDetails.status === UserStatus.LOGGED_IN_WALLET_INITIALIZED
              ? userDetails
              : undefined
          }
        />
      </Stack>
    );
  }

  return (
    <SimpleGrid columns={2}>
      <GridItem colSpan={2} bg="blue.500" h={12}>
        <Flex w="full" h="full" align="center" justify="center" color="black">
          <Text fontSize="xl">
            For more information,{" "}
            <Link
              isExternal
              href="https://docs.withpaper.com/reference/embedded-wallet-service-overview"
              fontWeight="bold"
            >
              read the docs &rarr;
            </Link>
          </Text>
        </Flex>
      </GridItem>
      <Box p={10} height="100vh">
        <Stack spacing={10}>
          <Image src="/paper-logo-icon.svg" maxW={14} alt="logo" />
          <Stack spacing={0}>
            <Heading>Wallets & Auth demo</Heading>
            <Text size="sm" fontStyle="italic" color="gray.500">
              by Paper
            </Text>
          </Stack>
          <Text maxW={400}>
            Welcome to Paper's Embedded Wallet Service (EWS) Alpha Sample App.
            <br />
            <br />
            With this alpha sample app, you can explore the various features of
            our EWS platform and get a feel for how it can benefit your own
            project
          </Text>

          {!!userDetails && userDetails.status !== UserStatus.LOGGED_OUT && (
            <Button
              alignSelf="start"
              onClick={logout}
              colorScheme="blue"
              variant="outline"
            >
              Logout
            </Button>
          )}
        </Stack>
      </Box>
      <Box
        bg="blue.200"
        boxShadow="-2px 0px 2px #6294b4"
        p={10}
        height="100vh"
        overflowY="auto"
      >
        {BodyComponent}
        {!!userDetails && (
          <Card mt={10} w="100%" bg="white">
            <CardBody>
              <CodeSnippet userDetails={userDetails} />
              <UserDetails userDetails={userDetails} />
            </CardBody>
          </Card>
        )}
      </Box>
    </SimpleGrid>
  );
}

export default App;
