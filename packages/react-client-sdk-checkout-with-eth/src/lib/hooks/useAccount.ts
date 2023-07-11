import type { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount as useAccountWagmi } from "wagmi";

type WagmiAccountProps = {
  signer?: ethers.Signer;
};

export const useAccount = ({
  signer,
}: WagmiAccountProps): {
  address?: string;
  chainId?: number;
  connector: any;
} => {
  const { address: _address, connector } = useAccountWagmi();
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    const updateFn = async () => {
      const newChainId =
        (await signer?.getChainId()) || (await connector?.getChainId());

      const newAddress = (await signer?.getAddress()) || _address;
      return { newChainId, newAddress };
    };
    updateFn()
      .then(({ newAddress, newChainId }) => {
        setAddress(newAddress);
        setChainId(newChainId);
      })
      .catch((e) => console.error(e));
  }, [signer, _address, connector]);

  return { address, connector, chainId };
};
