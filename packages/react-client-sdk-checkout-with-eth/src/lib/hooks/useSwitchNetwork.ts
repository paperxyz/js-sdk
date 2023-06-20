import type { ethers } from "ethers";
import { useCallback } from "react";

import type { Chain } from "wagmi";
import {
  allChains,
  SwitchChainNotSupportedError,
  useSwitchNetwork as useSwitchNetworkWagmi,
} from "wagmi";

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
        const chainToSwitchTo = allChains.find((x) => x.id === chainId);
        if (!chainToSwitchTo) {
          throw SwitchChainNotSupportedError;
        }
        if ((await signer.getChainId()) !== chainId) {
          throw SwitchChainNotSupportedError;
        }
        return chainToSwitchTo;
      }
      throw SwitchChainNotSupportedError;
    },
    [signer, _switchNetworkAsync],
  );

  return { switchNetworkAsync };
};
