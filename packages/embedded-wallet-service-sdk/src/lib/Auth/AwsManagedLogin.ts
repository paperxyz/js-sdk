import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
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
  override async loginWithPaperEmailOtp({
    email,
  }: {
    email: string;
  }): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithPaperModal",
      params: { email, recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED },
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
      params: { email, otp, recoveryShareManagement: RecoveryShareManagement.AWS_MANAGED },
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
      },
    });
    return this.postLogin(result);
  }
}
