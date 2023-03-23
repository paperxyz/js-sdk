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
  Text
} from "@chakra-ui/react";
import { PaperEmbeddedWalletSdk } from "@paperxyz/embedded-wallet-service-sdk";
import { useState } from "react";
interface Props {
  paper: PaperEmbeddedWalletSdk | undefined;
  onLoginSuccess: () => void;
}

export const Login: React.FC<Props> = ({ paper, onLoginSuccess }) => {
  const loginWithPaperModal = async () => {
    setIsLoading(true);
    try {
      const result = await paper?.auth.loginWithPaperModal();
      console.log(`loginWithPaper result: ${JSON.stringify(result, null, 2)}`);
      onLoginSuccess();
    } catch (e) {
      // use cancelled login flow
    }
    setIsLoading(false);
  };

  const [email, setEmail] = useState<string | null>(null);
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
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
  const loginWithPaperEmailOtp = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const result = await paper?.auth.loginWithPaperEmailOtp({
        email: email || "",
      });
      console.log("loginWithPaperEmailOtp result", result);
      onLoginSuccess();
    } catch (e) {
      // use closed login modal.
    }
    setIsLoading(false);
  };

  const loginWithPaperEmailOtpHeadless = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const result = await paper?.auth.sendPaperEmailLoginOtp({
        email: email || "",
      });
      console.log("sendPaperEmailLoginOtp result", result);
      setSendEmailOtpResult(result);
    } catch (e) {
      if (e instanceof Error) {
        setSendOtpErrorMessage(`${e.message}. Please try again later.`);
      }
      console.error(
        "Something went wrong sending otp email in headless flow",
        e
      );
    }
    setIsLoading(false);
  };

  const finishHeadlessOtpLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const result = await paper?.auth.verifyPaperEmailLoginOtp({
        email: email || "",
        otp: otpCode || "",
        recoveryCode: sendEmailOtpResult?.isNewUser
          ? undefined
          : recoveryCode || "",
      });
      console.log("verifyPaperEmailLoginOtp result", result);

      onLoginSuccess();
    } catch (e) {
      if (e instanceof Error) {
        setVerifyOtpErrorMessage(`${e.message}. Please try again`);
      }
      console.error("something went wrong verifying otp in headless flow", e);
    }
    setIsLoading(false);
  };

  return (
    <Card bg="white" borderRadius={8}>
      <CardBody>
        <Heading size="md">Log in</Heading>
        <Divider my={4} />
        <Button colorScheme="blue" onClick={loginWithPaperModal} w="full">
          Login with Paper Modal
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
            onClick={loginWithPaperEmailOtp}
            disabled={!email}
            isLoading={isLoading}
          >
            Login with Email OTP
          </Button>
        </Stack>

        {/* Adding code to allow internal full headless flow */}
        {(email?.endsWith("@withpaper.com") ?? false) && (
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
                      sendEmailOtpResult.isNewUser && (
                        <FormErrorMessage>
                          {verifyOtpErrorMessage}
                        </FormErrorMessage>
                      )}
                  </FormControl>
                  {sendEmailOtpResult.isNewDevice ? (
                    <FormControl as={Stack} isInvalid={!!verifyOtpErrorMessage}>
                      <Input
                        type="password"
                        placeholder="Recovery Code"
                        value={recoveryCode || ""}
                        onChange={(e) => {
                          setRecoveryCode(e.target.value);
                        }}
                      />
                      {!!verifyOtpErrorMessage && (
                        <FormErrorMessage>
                          {verifyOtpErrorMessage}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  ) : null}
                  <Button
                    type="submit"
                    onClick={finishHeadlessOtpLogin}
                    disabled={!email || !otpCode}
                    isLoading={isLoading}
                  >
                    verify and finish headless login
                  </Button>
                  <Button
                    onClick={loginWithPaperEmailOtpHeadless}
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
                      setRecoveryCode("");
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
                    onClick={loginWithPaperEmailOtpHeadless}
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
