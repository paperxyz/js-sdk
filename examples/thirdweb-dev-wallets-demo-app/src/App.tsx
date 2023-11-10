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
  LightMode,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  EmbeddedWalletSdk,
  GetUser,
  UserWalletStatus,
} from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useState } from "react";
import { CodeSnippet } from "./CodeSnippet";
import { Login } from "./Login";
import { WalletFeatures } from "./WalletFeatures";
import { WalletInfo } from "./WalletInfo";
import { UserDetails } from "./snippets/UserDetails";

function App() {
  const [thirdwebWallet, setThirdwebWallet] = useState<EmbeddedWalletSdk>();

  const [userDetails, setUserDetails] = useState<GetUser>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.location.origin.includes("thirdweb.com")) {
        window.localStorage.setItem("IS_PAPER_DEV", "true");
        window.localStorage.setItem(
          "PAPER_DEV_URL",
          "https://embedded-wallet.thirdweb-dev.com",
        );
      }
    }
  });

  useEffect(() => {
    const twWalletSdk = new EmbeddedWalletSdk({
      clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID!,
      chain: "Mumbai",
    });
    setThirdwebWallet(twWalletSdk);
  }, []);

  const fetchUserStatus = useCallback(async () => {
    if (!thirdwebWallet) {
      return;
    }

    console.log("grabbing paper user");
    const twUser = await thirdwebWallet.getUser();
    console.log("twUser", twUser);

    setUserDetails(twUser);
  }, [thirdwebWallet]);

  useEffect(() => {
    if (thirdwebWallet) {
      fetchUserStatus();
    }
  }, [thirdwebWallet, fetchUserStatus]);

  const logout = async () => {
    const response = await thirdwebWallet?.auth.logout();
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
  } else if (userDetails.status === UserWalletStatus.LOGGED_OUT) {
    BodyComponent = (
      <Login thirdwebWallet={thirdwebWallet} onLoginSuccess={fetchUserStatus} />
    );
  } else if (
    userDetails.status === UserWalletStatus.LOGGED_IN_WALLET_UNINITIALIZED ||
    userDetails.status === UserWalletStatus.LOGGED_IN_NEW_DEVICE
  ) {
    return null;
  } else {
    BodyComponent = (
      <Stack spacing={10}>
        <WalletInfo
          email={userDetails.authDetails.email}
          walletAddress={userDetails.walletAddress}
        />
        <WalletFeatures
          user={
            userDetails.status === UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED
              ? userDetails
              : undefined
          }
        />
      </Stack>
    );
  }

  return (
    <LightMode>
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <GridItem colSpan={{ base: 1, md: 2 }} bg="purple.500" h={12}>
          <Flex w="full" h="full" align="center" justify="center" color="white">
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
            <Image
              src="/thirdweb-light.svg"
              maxW={14}
              minW={"70%"}
              alt="logo"
            />
            <Stack spacing={0}>
              <Heading>Wallets & Auth demo</Heading>
              <Text size="sm" fontStyle="italic" color="gray.500">
                by thirdweb
              </Text>
            </Stack>
            <Text maxW={400}>
              Welcome to thirdweb's Embedded Wallet Service (EWS) Sample App.
              <br />
              <br />
              With this sample app, you can explore the various features of our
              EWS platform and get a feel for how it can benefit your own
              project
            </Text>

            {!!userDetails &&
              userDetails.status !== UserWalletStatus.LOGGED_OUT && (
                <Button
                  alignSelf="start"
                  onClick={logout}
                  colorScheme="purple"
                  variant="outline"
                >
                  Logout
                </Button>
              )}
          </Stack>
        </Box>
        <Box
          bg="purple.200"
          boxShadow="-2px 0px 2px #9444b4"
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
    </LightMode>
  );
}

export default App;
