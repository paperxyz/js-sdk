import { renderCheckoutWithEth } from "@paperxyz/js-client-sdk";
import { useEffect, useRef } from "react";
import { iframeContainer } from "../../lib/utils/styles";

const packageJson = require("../../package.json");

export function CheckoutWithEthV2() {
  const checkoutWithEthIframeContainerRef = useRef<HTMLDivElement>(null);

  // Handle message events from the popup. Pass along the message to the iframe as well
  useEffect(() => {
    if (!checkoutWithEthIframeContainerRef.current) {
      return;
    }
    renderCheckoutWithEth({});
  }, [checkoutWithEthIframeContainerRef.current]);

  return (
    <>
      <div
        className={iframeContainer}
        ref={checkoutWithEthIframeContainerRef}
        // Label the package version.
        data-paper-sdk-version={`@paperxyz/react-client-sdk@${packageJson.version}`}
      />
    </>
  );
}
