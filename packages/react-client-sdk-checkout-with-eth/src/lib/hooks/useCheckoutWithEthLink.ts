import type { CheckoutWithEthLinkArgs } from "@paperxyz/js-client-sdk";
import { createCheckoutWithEthLink } from "@paperxyz/js-client-sdk";
import type { ethers } from "ethers";
import { useEffect, useState } from "react";

export function useCheckoutWithEthLink({
  payingWalletSigner,
  sdkClientSecret,
  appName,
  locale,
  options,
  receivingWalletType,
  showConnectWalletOptions,
  configs,
}: Omit<CheckoutWithEthLinkArgs, "payingWalletSigner"> & {
  payingWalletSigner: ethers.Signer | undefined | null;
}) {
  const [checkoutWithEthUrl, setCheckoutWithEthUrl] = useState<URL | null>(
    null,
  );
  useEffect(() => {
    if (!payingWalletSigner) {
      return;
    }

    console.log("Before");
    createCheckoutWithEthLink({
      payingWalletSigner,
      sdkClientSecret,
      appName,
      locale,
      options,
      receivingWalletType,
      showConnectWalletOptions,
      configs,
    })
      .then((url) => {
        setCheckoutWithEthUrl(url);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [
    payingWalletSigner,
    sdkClientSecret,
    appName,
    locale,
    options,
    receivingWalletType,
    showConnectWalletOptions,
  ]);
  return { checkoutWithEthUrl };
}
