import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  AuthType,
} from "../../interfaces/Auth";
import type {
  ClientIdWithQuerierType,
  SendEmailOtpReturnType,
} from "../../interfaces/EmbeddedWallets/EmbeddedWallets";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";

type LoginQuerierTypes = {
  loginWithPaperModal:
    | undefined
    | { email: string; recoveryCode?: string }
    | { authType: AuthType }
    | { email: string };
  sendPaperEmailLoginOtp: { email: string; authType?: AuthType };
  verifyPaperEmailLoginOtp:
    | {
        email: string;
        otp: string;
        recoveryCode?: string;
      }
    | {
        email: string;
        otp: string;
        authType: AuthType;
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
    authType,
  }: LoginQuerierTypes["sendPaperEmailLoginOtp"]): Promise<SendEmailOtpReturnType> {
    await this.preLogin();
    const { isNewUser, isNewDevice } =
      await this.LoginQuerier.call<SendEmailOtpReturnType>({
        procedureName: "sendPaperEmailLoginOtp",
        params: { email, authType },
      });
    return { isNewUser, isNewDevice };
  }

  abstract verifyPaperEmailLoginOtp(
    args: EMAIL_VERIFICATION,
  ): Promise<AuthLoginReturnType>;
}
