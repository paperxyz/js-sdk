import {
  getConfig,
  prepareSendTransaction,
  sendTransaction,
} from "@wagmi/core";

import type { ethers } from "ethers";
import { useCallback, useState } from "react";

export const useSendTransaction = ({ signer }: { signer?: ethers.Signer }) => {
  const [isSendingTransaction, setIsSendingTransaction] = useState(false);
  const sendTransactionAsync = useCallback(
    async (args?: { chainId: number; request: Record<string, any> }) => {
      if (!args || !args.request.to) {
        console.log("no argument for transaction, returning");
        return;
      }

      if (signer) {
        setIsSendingTransaction(true);
        try {
          const response = await signer?.sendTransaction(args?.request || {});
          const receipt = await response.wait();
          setIsSendingTransaction(false);
          return { response, receipt };
        } catch (e) {
          setIsSendingTransaction(false);
          throw e;
        }
      } else {
        setIsSendingTransaction(true);
        const config = await prepareSendTransaction({
          chainId: args.chainId,
          request: { to: args.request.to, ...args.request },
        });
        const responsePartial = await sendTransaction(config);
        const config = getConfig({ chainId: args.chainId });
        const response = await config.getTransaction(responsePartial.hash);
        const receipt = await response.wait();
        setIsSendingTransaction(false);
        return { response, receipt };
      }
    },
    [signer],
  );

  return { sendTransactionAsync, isSendingTransaction };
};
