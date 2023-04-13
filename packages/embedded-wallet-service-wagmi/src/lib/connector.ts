import type {
  InitializedUser,
  PaperConstructorType,
} from "@paperxyz/embedded-wallet-service-sdk";
import {
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import type { Signer, providers } from "ethers";
import {
  Address,
  Chain,
  Connector,
  ConnectorData,
  UserRejectedRequestError,
} from "wagmi";
import {
  avalanche,
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
} from "wagmi/chains";

const IS_SERVER = typeof window === "undefined";

/**
 * @returns A Wagmi-compatible connector.
 */
export class PaperEmbeddedWalletWagmiConnector extends Connector<
  providers.Provider,
  PaperConstructorType
> {
  readonly ready = !IS_SERVER;
  readonly id = "paper-embedded-wallet";
  readonly name = "Paper Embedded Wallet";

  #sdk: PaperEmbeddedWalletSdk;
  #paperOptions: PaperConstructorType;
  #provider?: providers.Provider;
  #user: InitializedUser | null;

  constructor(config: { chains?: Chain[]; options: PaperConstructorType }) {
    super(config);

    if (!config.options.clientId) {
      throw new Error(
        "No client ID provided. Provide your Paper Embedded Wallet client ID found in the Developer Dashboard.",
      );
    }

    this.#paperOptions = config.options;
    this.#sdk = new PaperEmbeddedWalletSdk(this.#paperOptions);
    this.#user = null;
  }

  getChain(): Chain {
    switch (this.#paperOptions.chain) {
      case "Ethereum":
        return mainnet;
      case "Goerli":
        return goerli;
      case "Polygon":
        return polygon;
      case "Mumbai":
        return polygonMumbai;
      case "Avalanche":
        return avalanche;
      default:
        throw new Error(
          "Unsupported chain. See https://docs.withpaper.com/docs/embedded-wallets-faq for supported chains.",
        );
    }
  }

  async getAccount(): Promise<Address> {
    const user = await this.getUser();
    if (!user) {
      throw new Error(`User is not logged in. Try calling "connect()" first.`);
    }
    const account = user.walletAddress;
    return account.startsWith("0x") ? (account as Address) : `0x${account}`;
  }

  async getProvider(config?: {
    chainId?: number;
  }): Promise<providers.Provider> {
    if (!this.#provider) {
      const signer = await this.getSigner();
      if (!signer.provider) {
        throw new Error(`Failed to get Signer. Try calling "connect()" first.`);
      }
      this.#provider = signer.provider;
    }
    return this.#provider;
  }

  async getSigner(): Promise<Signer> {
    const user = await this.getUser();
    if (!user) {
      throw new Error(`User is not logged in. Try calling "connect()" first.`);
    }
    const signer = await user.wallet.getEthersJsSigner();
    return signer;
  }

  protected onAccountsChanged(accounts: Address[]): void {
    const account = accounts[0];
    if (!account) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account });
    }
  }

  protected onDisconnect(error: Error): void {
    this.emit("disconnect");
  }

  async connect(): Promise<Required<ConnectorData>> {
    const provider = await this.getProvider();
    if (provider?.on) {
      provider.on("accountsChanged", this.onAccountsChanged.bind(this));
      provider.on("chainChanged", this.onChainChanged.bind(this));
      provider.on("disconnect", this.onDisconnect.bind(this));
    }

    // If not authenticated, prompt the user to log in.
    const isAuthenticated = await this.isAuthorized();
    if (!isAuthenticated) {
      try {
        const resp = await this.#sdk.auth.loginWithPaperModal();
        if (resp.user.status !== UserStatus.LOGGED_IN_WALLET_INITIALIZED) {
          throw new Error(
            "Unexpected user status after logging in. Please try logging in again.",
          );
        }
      } catch (e) {
        throw new UserRejectedRequestError(e);
      }
    }

    return {
      provider,
      chain: {
        id: await this.getChainId(),
        unsupported: false,
      },
      account: await this.getAccount(),
    };
  }

  getChainId(): Promise<number> {
    return Promise.resolve(this.getChain().id);
  }

  async isAuthorized() {
    const user = await this.getUser();
    return !!user;
  }

  async disconnect(): Promise<void> {
    await this.#sdk.auth.logout();
    this.#user = null;
  }

  protected onChainChanged(chainId: string | number): void {
    const id = Number(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }

  async getUser(): Promise<InitializedUser | null> {
    if (!this.#user) {
      const userStatus = await this.#sdk.getUser();
      if (userStatus.status === UserStatus.LOGGED_IN_WALLET_INITIALIZED) {
        this.#user = userStatus;
      }
    }
    return this.#user;
  }
}
