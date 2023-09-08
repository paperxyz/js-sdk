import {
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { EmbeddedWalletSdk } from "@thirdweb-dev/wallets";
import { useState } from "react";
interface Props {
  thirdwebWallet: EmbeddedWalletSdk | undefined;
  onLoginSuccess: () => void;
}

export const Login: React.FC<Props> = ({ thirdwebWallet, onLoginSuccess }) => {
  const loginWithThirdwebModal = async () => {
    setIsLoading(true);
    try {
      await thirdwebWallet?.auth.loginWithModal();
      onLoginSuccess();
    } catch (e) {
      // use cancelled login flow
    }
    setIsLoading(false);
  };

  const [email, setEmail] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string | null>(null);
  const [sendEmailOtpResult, setSendEmailOtpResult] = useState<
    | {
        isNewUser: boolean;
        isNewDevice: boolean;
      }
    | undefined
  >(undefined);
  const [sendOtpErrorMessage, setSendOtpErrorMessage] = useState("");
  const [verifyOtpErrorMessage, setVerifyOtpErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginWithThirdwebEmailOtp = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const result = await thirdwebWallet?.auth.loginWithEmailOtp({
        email: email || "",
      });
      console.log("loginWithThirdwebEmailOtp result", result);
      onLoginSuccess();
    } catch (e) {
      // use closed login modal.
    }
    setIsLoading(false);
  };

  const loginWithGoogleHeadless = async () => {
    setIsLoading(true);
    try {
      const result = await thirdwebWallet?.auth.loginWithGoogle();
      console.log("loginWithGoogle result", result);
      onLoginSuccess();
    } catch (e) {
      console.warn("Error logging in with Google", e);
    }
    setIsLoading(false);
  };

  const loginWithThirdwebEmailOtpHeadless = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const result = await thirdwebWallet?.auth.sendEmailLoginOtp({
        email: email || "",
      });
      console.log("sendThirdwebEmailLoginOtp result", result);
      setSendEmailOtpResult(result);
    } catch (e) {
      if (e instanceof Error) {
        setSendOtpErrorMessage(`${e.message}. Please try again later.`);
      }
      console.error(
        "Something went wrong sending otp email in headless flow",
        e,
      );
    }
    setIsLoading(false);
  };

  const finishHeadlessOtpLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const result = await thirdwebWallet?.auth.verifyEmailLoginOtp({
        email: email || "",
        otp: otpCode || "",
      });
      console.log("verifyThirdwebEmailLoginOtp result", result);

      onLoginSuccess();
    } catch (e) {
      console.error("ERROR verifying otp", e);
      setVerifyOtpErrorMessage(`${(e as any).message}. Please try again`);
    }
    setIsLoading(false);
  };

  return (
    <Card bg="white" borderRadius={8}>
      <CardBody>
        <Heading size="md">Log in</Heading>
        <Divider my={4} />
        <Button
          colorScheme="purple"
          onClick={loginWithThirdwebModal}
          w="full"
          isLoading={isLoading}
        >
          Login with thirdweb modal
        </Button>

        <Flex my={4} alignItems="center">
          <Divider />
          <Text mx={4}>or</Text>
          <Divider />
        </Flex>
        <Stack as="form">
          <FormControl as={Stack}>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email || ""}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormControl>
          <Button
            type="submit"
            onClick={loginWithThirdwebEmailOtp}
            disabled={!email}
            isLoading={isLoading}
          >
            Login with Email OTP
          </Button>
        </Stack>

        <Flex my={4} alignItems="center">
          <Divider />
          <Text mx={4}>or</Text>
          <Divider />
        </Flex>
        <Button
          w={"full"}
          onClick={loginWithGoogleHeadless}
          isLoading={isLoading}
        >
          Login With Google Directly
        </Button>

        {/* Adding code to allow internal full headless flow */}
        {(email?.endsWith("@thirdweb.com") ?? false) && (
          <>
            <Flex my={4} alignItems="center">
              <Divider />
              <Text mx={4}>or</Text>
              <Divider />
            </Flex>
            <Stack as="form">
              {sendEmailOtpResult ? (
                <>
                  <FormControl as={Stack} isInvalid={!!verifyOtpErrorMessage}>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Otp Code"
                      value={otpCode || ""}
                      onChange={(e) => {
                        setOtpCode(e.target.value);
                      }}
                    />
                    {!!verifyOtpErrorMessage &&
                      !sendEmailOtpResult.isNewDevice && (
                        <FormErrorMessage>
                          {verifyOtpErrorMessage}
                        </FormErrorMessage>
                      )}
                  </FormControl>

                  <Button
                    type="submit"
                    onClick={finishHeadlessOtpLogin}
                    disabled={!email || !otpCode}
                    isLoading={isLoading}
                  >
                    verify and finish headless login
                  </Button>
                  <Button
                    onClick={loginWithThirdwebEmailOtpHeadless}
                    variant="ghost"
                    size="sm"
                  >
                    Request New Code
                  </Button>
                  <Button
                    variant={"ghost"}
                    w="fit-content"
                    onClick={() => {
                      setOtpCode("");
                      setSendEmailOtpResult(undefined);
                    }}
                  >
                    Back
                  </Button>
                </>
              ) : (
                <>
                  <FormControl as={Stack} isInvalid={!!sendOtpErrorMessage}>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email || ""}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    {!!sendOtpErrorMessage && (
                      <FormErrorMessage>{sendOtpErrorMessage}</FormErrorMessage>
                    )}
                  </FormControl>
                  <Button
                    type="submit"
                    onClick={loginWithThirdwebEmailOtpHeadless}
                    disabled={!email}
                    isLoading={isLoading}
                  >
                    send headless Email OTP
                  </Button>
                </>
              )}
            </Stack>
          </>
        )}
      </CardBody>
    </Card>
  );
};
