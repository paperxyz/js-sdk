import type { FetchSignerResult } from '@wagmi/core';
import { ethers } from 'ethers';

export async function setUpSigner({
  signer,
  chainId,
  walletType,
  onSuccess,
}: {
  signer: FetchSignerResult<ethers.Signer>;
  chainId: number;
  walletType?: string;
  onSuccess: () => void;
}) {
  try {
    if (signer) {
      if ((await signer.getChainId()) !== chainId) {
        const { switchNetwork, fetchSigner } = await import('@wagmi/core');
        await switchNetwork({ chainId: chainId });
        signer = await fetchSigner();
        if (!signer) {
          throw new Error('BAD STATE. Missing signer');
        }
      }
      onSuccess();
      return { signer, walletType };
    }
  } catch (e) {
    console.error(e);
    if (signer) {
      onSuccess();
      return { signer, walletType };
    }
  }
  return;
}
