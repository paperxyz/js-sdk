import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
} from "../../interfaces/Auth";
import { AbstractLogin } from "./AbstractLogin";
export class UserManagedLogin extends AbstractLogin<
  {
    getRecoveryCode: (userWalletId: string) => Promise<string | undefined>;
  },
  { email: string; recoveryCode?: string },
  { email: string; otp: string; recoveryCode?: string }
> {
  override async loginWithPaperModal(args?: {
    getRecoveryCode: (userWalletId: string) => Promise<string | undefined>;
  }): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithPaperModal",
      params: undefined,
      showIframe: true,
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
        getRecoveryCode: args?.getRecoveryCode,
      },
    });
    return this.postLogin(result);
  }

  override async loginWithGoogle(args?: {
    windowOpened?: Window | null;
  }): Promise<AuthLoginReturnType> {
    throw new Error(
      "loginWithGoogle is not yet supported in the RecoveryShareManagement.USER_MANAGED flow. Please use RecoveryShareManagement.AWS_MANAGED instead.",
    );
  }

  override async loginWithPaperEmailOtp({
    email,
    recoveryCode,
  }: {
    email: string;
    recoveryCode?: string | undefined;
  }): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithPaperModal",
      params: { email, recoveryCode },
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
    recoveryCode,
  }: {
    email: string;
    otp: string;
    recoveryCode?: string | undefined;
  }): Promise<AuthLoginReturnType> {
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "verifyPaperEmailLoginOtp",
      params: { email, otp, recoveryCode },
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
      },
    });
    return this.postLogin(result);
  }
}
