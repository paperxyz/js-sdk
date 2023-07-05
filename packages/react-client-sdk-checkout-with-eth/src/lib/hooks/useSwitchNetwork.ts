import type { ethers } from "ethers";
import { useCallback } from "react";

import type { Chain } from "wagmi";
import { useSwitchNetwork as useSwitchNetworkWagmi } from "wagmi";
import { WagmiChains } from "../../components/checkoutWithEth";

export const useSwitchNetwork = ({
  signer: signer,
}: {
  signer?: ethers.Signer;
}): {
  switchNetworkAsync: (chainId: number) => Promise<Chain>;
} => {
  const { switchNetworkAsync: _switchNetworkAsync } = useSwitchNetworkWagmi();

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (_switchNetworkAsync) {
        return await _switchNetworkAsync?.(chainId);
      } else if (signer) {
        const chainToSwitchTo = WagmiChains.find((x) => x.id === chainId);
        if (!chainToSwitchTo) {
          const error = `Error switching chain. Please switch your network to chain with chainId: ${chainId}`;
          throw new Error(error);
        }
        if ((await signer.getChainId()) !== chainId) {
          const error = `Error switching chain. Please switch your network to ${
            chainToSwitchTo?.name ?? `chain with chainId: ${chainId}`
          }`;
          throw new Error(error);
        }
        return chainToSwitchTo;
      }
      const error = `Error switching chain. Please switch your network to chain with chainId: ${chainId}`;
      throw new Error(error);
    },
    [signer, _switchNetworkAsync],
  );

  return { switchNetworkAsync };
};
