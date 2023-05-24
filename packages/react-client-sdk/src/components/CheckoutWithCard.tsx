import type {
  ICheckoutWithCardConfigs,
  PaperSDKError,
  PriceSummary,
  ReviewResult,
} from "@paperxyz/js-client-sdk";
import { createCheckoutWithCardElement } from "@paperxyz/js-client-sdk";
import type {
  ICustomizationOptions,
  Locale,
} from "@paperxyz/sdk-common-utilities";
import { DEFAULT_BRAND_OPTIONS } from "@paperxyz/sdk-common-utilities";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePaperSDKContext } from "../Provider";
import type { PaymentSuccessResult } from "../interfaces/PaymentSuccessResult";
import { iframeContainer } from "../lib/utils/styles";
import { SpinnerWrapper } from "./common/SpinnerWrapper";
const packageJson = require("../../package.json");

interface CheckoutWithCardProps {
  sdkClientSecret?: string;
  onPaymentSuccess: (result: PaymentSuccessResult) => void;
  appName?: string;
  options?: ICustomizationOptions;
  onReview?: (result: ReviewResult) => void;
  onError?: (error: PaperSDKError) => void;
  onBeforeModalOpen?: (props: { url: string }) => void;
  onPriceUpdate?: (priceSummary: PriceSummary) => void;
  configs?: ICheckoutWithCardConfigs;

  /**
   * @deprecated No longer used.
   */
  experimentalUseAltDomain?: boolean;

  /**
   * Sets the locale to a supported language.
   * NOTE: Localization is in early alpha and many languages are not yet supported.
   *
   * Defaults to English.
   */
  locale?: Locale;
}

export const CheckoutWithCard = ({
  sdkClientSecret,
  appName,
  options = {
    ...DEFAULT_BRAND_OPTIONS,
  },
  onPaymentSuccess,
  onReview,
  onError,
  onBeforeModalOpen,
  onPriceUpdate,
  locale,
  configs,
}: CheckoutWithCardProps): React.ReactElement => {
  const { appName: appNameContext } = usePaperSDKContext();
  const [isCardDetailIframeLoading, setIsCardDetailIframeLoading] =
    useState<boolean>(true);
  const onCardDetailLoad = useCallback(() => {
    setIsCardDetailIframeLoading(false);
  }, []);
  const CheckoutWithCardIframeContainerRef = useRef<HTMLDivElement>(null);
  const appNameToUse = appName || appNameContext;

  // Handle message events from the popup. Pass along the message to the iframe as well
  useEffect(() => {
    if (!CheckoutWithCardIframeContainerRef.current) {
      return;
    }
    createCheckoutWithCardElement({
      sdkClientSecret,
      appName: appNameToUse,
      elementOrId: CheckoutWithCardIframeContainerRef.current,
      locale,
      onError,
      onLoad: onCardDetailLoad,
      onPaymentSuccess,
      onReview,
      onBeforeModalOpen,
      onPriceUpdate,
      options,
      configs,
    });
  }, [CheckoutWithCardIframeContainerRef.current]);

  return (
    <>
      <div
        className={iframeContainer}
        ref={CheckoutWithCardIframeContainerRef}
        // Label the package version.
        data-paper-sdk-version={`@paperxyz/react-client-sdk@${packageJson.version}`}
      >
        {isCardDetailIframeLoading && <SpinnerWrapper />}
      </div>
    </>
  );
};
