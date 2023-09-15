import type {
  AuthDetails,
  InitializedUser,
  SetUpWalletRpcReturnType,
} from "./EmbeddedWallets/EmbeddedWallets";

export enum RecoveryShareManagement {
  USER_MANAGED = "USER_MANAGED",
  AWS_MANAGED = "AWS_MANAGED",
}

export type AdvancedOptions<T extends RecoveryShareManagement> = {
  // This is a hack to allow us to assign default value to recoveryShareManagement
  recoveryShareManagement: RecoveryShareManagement | T;
};

export enum AuthProvider {
  PAPER_EMAIL_OTP = "PaperEmailOTP",
  GOOGLE = "Google",
  TWITTER = "Twitter",
  COGNITO = "Cognito",
  AUTH0 = "Auth0",
  CUSTOM_JWT = "CustomJWT",
}

export type GetSocialLoginClientIdReturnType = {
  clientId: string;
};

export type GetHeadlessLoginLinkReturnType = {
  loginLink: string;
};

// TODO: Clean up tech debt of random type Objects
// E.g. StoredTokenType is really not used anywhere but it exists as this object for legacy reason
export type StoredTokenType = {
  jwtToken: string;
  authProvider: AuthProvider;
  authDetails: AuthDetails;
  developerClientId: string;
};

export type AuthStoredTokenWithCookieReturnType = {
  storedToken: StoredTokenType & {
    cookieString: string;
    shouldStoreCookieString: boolean;
    isNewUser: boolean;
  };
};
export type AuthAndWalletRpcReturnType = AuthStoredTokenWithCookieReturnType & {
  walletDetails: SetUpWalletRpcReturnType;
};

export type AuthLoginReturnType = { user: InitializedUser };
