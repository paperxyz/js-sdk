import {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
} from "../../interfaces/Auth";
import {
  ClientIdWithQuerierType,
  SendEmailOtpReturnType,
} from "../../interfaces/EmbeddedWallets/EmbeddedWallets";
import { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";
import { AuthQuerierTypes } from "./index.";

type LoginQuerierTypes = {
  loginWithPaperModal: void | { email: string; recoveryCode?: string };
  sendPaperEmailLoginOtp: { email: string };
  verifyPaperEmailLoginOtp: {
    email: string;
    otp: string;
    recoveryCode?: string;
  };
};

export abstract class AbstractLogin<
  MODAL = void,
  EMAIL_MODAL extends { email: string } = { email: string },
  EMAIL_VERIFICATION extends { email: string; otp: string } = {
    email: string;
    otp: string;
  },
> {
  protected LoginQuerier: EmbeddedWalletIframeCommunicator<LoginQuerierTypes>;
  protected preLogin;
  protected postLogin: (
    authResults: AuthAndWalletRpcReturnType,
  ) => Promise<AuthLoginReturnType>;

  /**
   * Used to manage the user's auth states. This should not be instantiated directly.
   * Call {@link PaperEmbeddedWalletSdk.auth} instead.
   *
   * Authentication settings can be managed via the [authentication settings dashboard](https://withpaper.com/dashboard/embedded-wallets/auth-settings)
   */
  constructor({
    querier,
    preLogin,
    postLogin,
  }: Omit<ClientIdWithQuerierType, "clientId"> & {
    preLogin: () => Promise<void>;
    postLogin: (
      authDetails: AuthAndWalletRpcReturnType,
    ) => Promise<AuthLoginReturnType>;
  }) {
    this.LoginQuerier = querier;
    this.preLogin = preLogin;
    this.postLogin = postLogin;
  }

  abstract loginWithPaperModal(args?: MODAL): Promise<AuthLoginReturnType>;
  abstract loginWithPaperEmailOtp(
    args: EMAIL_MODAL,
  ): Promise<AuthLoginReturnType>;

  async sendPaperEmailLoginOtp({
    email,
  }: AuthQuerierTypes["sendPaperEmailLoginOtp"]): Promise<SendEmailOtpReturnType> {
    await this.preLogin();
    const { isNewUser, isNewDevice } =
      await this.LoginQuerier.call<SendEmailOtpReturnType>({
        procedureName: "sendPaperEmailLoginOtp",
        params: { email },
      });
    return { isNewUser, isNewDevice };
  }

  abstract verifyPaperEmailLoginOtp(
    args: EMAIL_VERIFICATION,
  ): Promise<AuthLoginReturnType>;
}
