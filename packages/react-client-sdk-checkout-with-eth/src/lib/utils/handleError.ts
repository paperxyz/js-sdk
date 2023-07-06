import type { PaperSDKError } from "@paperxyz/js-client-sdk";
import { PayWithCryptoErrorCode } from "@paperxyz/js-client-sdk";

export interface IErrorObject {
  isErrorObject: boolean;
  title: PayWithCryptoErrorCode;
  description: string;
}

export function handlePayWithCryptoError(
  error: Error | IErrorObject,
  onError?: (code: PaperSDKError) => void,
  postToParent?: (errorObject: Omit<IErrorObject, "isErrorObject">) => void,
) {
  // No error passed.
  if (!error) {
    const error = new Error("Something went wrong, contact support.");
    onError?.({ code: PayWithCryptoErrorCode.ErrorSendingTransaction, error });
    postToParent?.({
      title: PayWithCryptoErrorCode.ErrorSendingTransaction,
      description: "Something went wrong, contact support.",
    });
    // Custom error object.
  } else if ("isErrorObject" in error) {
    onError?.({ code: error.title, error: new Error(error.title) });
    postToParent?.({ ...error });
    // Users denied the transaction.
  } else if (
    error?.message?.includes("rejected") ||
    error?.message?.includes("denied transaction")
  ) {
    onError?.({ code: PayWithCryptoErrorCode.TransactionCancelled, error });
    postToParent?.({
      title: PayWithCryptoErrorCode.TransactionCancelled,
      description: "",
    });
    // Insufficient funds.
  } else if (error?.message?.includes("insufficient funds")) {
    onError?.({
      code: PayWithCryptoErrorCode.InsufficientBalance,
      error,
    });
    postToParent?.({
      title: PayWithCryptoErrorCode.InsufficientBalance,
      description: `Check your wallet's ETH balance to make sure you have enough`,
    });
    // Failed to switch chains
  } else if (error?.message?.includes("Error switching chain")) {
    onError?.({
      code: PayWithCryptoErrorCode.ChainSwitchUnderway,
      error,
    });
    postToParent?.({
      title: PayWithCryptoErrorCode.ChainSwitchUnderway,
      description: "Check your wallet app",
    });
    // Catch-all.
  } else {
    onError?.({
      code: PayWithCryptoErrorCode.ErrorSendingTransaction,
      error: error.message
        ? error
        : new Error(`Something went wrong when sending the transaction`),
    });
    postToParent?.({
      title: PayWithCryptoErrorCode.ErrorSendingTransaction,
      description:
        `${error?.message}` ??
        `Something went wrong when sending the transaction`,
    });
  }
}
