import { getPaperOriginUrl } from "@paperxyz/sdk-common-utilities";
import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  GetHeadlessLoginLinkReturnType,
} from "../../interfaces/Auth";
import { RecoveryShareManagement } from "../../interfaces/Auth";
import { AbstractLogin } from "./AbstractLogin";

export class AwsManagedLogin extends AbstractLogin<
  void,
  { email: string },
  { email: string; otp: string }
> {
  override async loginWithPaperModal(): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithPaperModal",
      params: { recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED },
      showIframe: true,
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
      },
    });
    return this.postLogin(result);
  }

  private async getGoogleLoginUrl(): Promise<GetHeadlessLoginLinkReturnType> {
    const result = await this.LoginQuerier.call<GetHeadlessLoginLinkReturnType>(
      {
        procedureName: "getHeadlessGoogleLoginLink",
        params: undefined,
      },
    );
    return result;
  }

  override async loginWithGoogle(args?: {
    windowOpened?: Window | null;
  }): Promise<AuthLoginReturnType> {
    let win = args?.windowOpened;
    if (!win) {
      win = window.open("", "Login", "width=350, height=500");
    }
    if (!win) {
      throw new Error("Something went wrong opening pop-up");
    }
    await this.preLogin();
    // fetch the url to open the login window from iframe
    const { loginLink } = await this.getGoogleLoginUrl();

    win.location.href = loginLink;

    // listen to result from the login window
    const result = await new Promise<AuthAndWalletRpcReturnType>(
      (resolve, reject) => {
        // detect when the user closes the login window
        const pollTimer = window.setInterval(async () => {
          if (!win) {
            return;
          }
          if (win.closed) {
            clearInterval(pollTimer);
            reject(new Error("User closed login window"));
          }
        }, 1000);

        const messageListener = async (
          event: MessageEvent<{
            eventType: string;
            authResult?: AuthAndWalletRpcReturnType;
            error?: string;
          }>,
        ) => {
          console.log("event", event);
          console.log("event.origin", event.origin);
          console.log("getPaperOriginUrl()", getPaperOriginUrl());
          if (event.origin !== getPaperOriginUrl()) {
            return;
          }
          if (typeof event.data !== "object") {
            reject(new Error("Invalid event data"));
            return;
          }

          console.log("event.data", event.data);
          switch (event.data.eventType) {
            case "userLoginSuccess": {
              window.removeEventListener("message", messageListener);
              clearInterval(pollTimer);
              win?.close();
              if (event.data.authResult) {
                resolve(event.data.authResult);
              }
              return;
            }
            case "userLoginFailed": {
              window.removeEventListener("message", messageListener);
              clearInterval(pollTimer);
              // win?.close();
              reject(new Error(event.data.error));
              break;
            }
            case "injectDeveloperClientId": {
              console.log("this.clientId", this.clientId);
              win?.postMessage(
                {
                  eventType: "injectDeveloperClientIdResult",
                  developerClientId: this.clientId,
                },
                getPaperOriginUrl(),
              );
            }
          }
        };
        window.addEventListener("message", messageListener);
      },
    );

    return this.postLogin({
      storedToken: { ...result.storedToken, shouldStoreCookieString: true },
      walletDetails: { ...result.walletDetails, isIframeStorageEnabled: false },
    });
  }

  override async loginWithPaperEmailOtp({
    email,
  }: {
    email: string;
  }): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithPaperModal",
      params: {
        email,
        recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED,
      },
      showIframe: true,
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
      },
    });
    return this.postLogin(result);
  }
  override async verifyPaperEmailLoginOtp({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }): Promise<AuthLoginReturnType> {
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "verifyPaperEmailLoginOtp",
      params: {
        email,
        otp,
        recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED,
      },
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
      },
    });
    return this.postLogin(result);
  }
}

// https://auth.withpaper.com/oauth/authorize?response_type=code&identity_provider=Google&redirect_uri=https%3A%2F%2Fwithpaper.com%2Fsdk%2F2022-08-12%2Fembedded-wallet%2Fauth%2Fheadless-google-login-managed&client_id=2e02ha2ce6du13ldk8pai4h3d0
