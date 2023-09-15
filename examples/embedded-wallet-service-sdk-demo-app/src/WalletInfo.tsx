import {
  Card,
  CardBody,
  Heading,
  Divider,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";

interface Props {
  email: string | undefined;
  walletAddress: string | undefined;
}

export const WalletInfo: React.FC<Props> = ({ email, walletAddress }) => {
  return (
    <Card bg="white" borderRadius={8}>
      <CardBody>
        <Heading size="md" color="black">Authenticated and Wallet ready!</Heading>
        <Divider my={4} />
        <Stack spacing={4}>
          <Text maxW={400} color="black">
            You have successfully authenticated and your wallet is ready to use
            on this device.
          </Text>

          <Card variant="outline">
            <CardBody>
              <strong>Authenticated email:</strong> {email}
            </CardBody>
          </Card>
          <Card variant="outline">
            <CardBody>
              <strong>Wallet address: </strong>
              <Link
              color="black"
                isExternal
                textDecoration="underline"
                href={`https://mumbai.polygonscan.com/address/${walletAddress}`}
              >
                {walletAddress}
              </Link>
            </CardBody>
          </Card>
        </Stack>
      </CardBody>
    </Card>
  );
};
