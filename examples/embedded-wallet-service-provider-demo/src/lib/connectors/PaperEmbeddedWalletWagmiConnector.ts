import type {
  InitializedUser,
  PaperConstructorType,
} from "@paperxyz/embedded-wallet-service-sdk";
import {
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import type { Signer, ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import type { Address, Chain, ConnectorData } from "wagmi";
import { Connector, UserRejectedRequestError } from "wagmi";
import {
  avalanche,
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
} from "wagmi/chains";

const IS_SERVER = typeof window === "undefined";
const CONNECT_EMAIL = "wagmi-paper-connector.connect.email";
const CONNECT_TIME_KEY = "wagmi-paper-connector.connect.time";
const CONNECT_DURATION = 604800000; // 7 days in milliseconds

export interface IPaperEmbeddedWalletWagmiConnectorOptions {
  chains?: Chain[];
  options: PaperConstructorType;
}

export class PaperEmbeddedWalletWagmiConnector extends Connector {
  ready = !IS_SERVER;
  readonly id = "paper";
  readonly name = "Email";

  paperOptions: PaperConstructorType;
  paperSdk?: PaperEmbeddedWalletSdk;
  provider?: ethers.providers.Provider;

  constructor(config: IPaperEmbeddedWalletWagmiConnectorOptions) {
    super(config);

    if (!config.options.clientId) {
      throw new Error(
        "No client ID provided. Provide your Paper Embedded Wallet client ID found in the Developer Dashboard.",
      );
    }

    this.paperOptions = config.options;
  }

  getSdk(): PaperEmbeddedWalletSdk {
    if (!this.paperSdk) {
      this.paperSdk = new PaperEmbeddedWalletSdk(this.paperOptions);
    }
    return this.paperSdk;
  }

  getChain(): Chain {
    switch (this.paperOptions.chain) {
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
    const account = user?.walletAddress;
    if (account?.startsWith("0x")) return account as Address;
    return `0x${account}`;
  }

  async getProvider(): Promise<ethers.providers.Provider | null> {
    if (!this.provider) {
      const signer = await this.getSigner();
      if (!signer?.provider) {
        return null;
      }
      this.provider = signer.provider;
    }
    return this.provider;
  }

  async getSigner(): Promise<Signer | null> {
    const user = await this.getUser();
    if (!user) {
      return null;
    }
    const signer = await user.wallet.getEthersJsSigner();
    return signer;
  }

  protected onAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) this.emit("disconnect");
    else this.emit("change", { account: getAddress(accounts[0]) });
  }

  protected onDisconnect(): void {
    this.emit("disconnect");
  }

  async connect(): Promise<Required<ConnectorData>> {
    const provider = await this.getProvider();
    if (provider?.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }

    // Check if there is a user logged in.
    const [isAuthenticated, currentUser, chainId] = await Promise.all([
      this.isAuthorized(),
      this.getUser(),
      this.getChainId(),
    ]);

    // Return the authenticated user, if any.
    if (
      isAuthenticated &&
      localStorage.getItem(CONNECT_EMAIL) === currentUser?.authDetails.email
    ) {
      return {
        provider,
        chain: {
          id: chainId,
          unsupported: false,
        },
        account: await this.getAccount(),
      };
    }

    // Prompt the user to log in via the modal.
    try {
      const resp = await this.getSdk().auth.loginWithPaperModal();
      const email = resp?.user?.authDetails?.email;

      if (email) {
        const signer = await this.getSigner();
        if (!signer) {
          throw new Error("No signer.");
        }

        const account = (await signer.getAddress()) as Address;

        // storing timestamp and email of connected paper wallet
        window.localStorage.setItem(
          CONNECT_TIME_KEY,
          String(new Date().getTime()),
        );
        window.localStorage.setItem(CONNECT_EMAIL, email);

        return {
          provider,
          chain: {
            id: chainId,
            unsupported: false,
          },
          account,
        };
      }
    } catch (error) {
      console.error("Authenticating to Paper Embedded Wallet:", error);
    }

    throw new UserRejectedRequestError(
      "Unable to authenticate a Paper Embedded Wallet user.",
    );
  }

  getChainId(): Promise<number> {
    return Promise.resolve(this.getChain().id);
  }

  async isAuthorized() {
    const user = await this.getUser();
    const connectTime = window.localStorage.getItem(CONNECT_TIME_KEY);
    if (
      user === null ||
      !connectTime ||
      !window.localStorage.getItem(CONNECT_EMAIL)
    ) {
      return false;
    }
    return parseInt(connectTime) + CONNECT_DURATION > new Date().getTime();
  }

  async disconnect(): Promise<void> {
    window.localStorage.removeItem(CONNECT_TIME_KEY);
    window.localStorage.removeItem(CONNECT_EMAIL);
    await this.getSdk().auth.logout();
  }

  protected onChainChanged(chainId: string | number): void {
    const id = Number(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }

  async getUser(): Promise<InitializedUser | null> {
    const userStatus = await this.getSdk().getUser();
    if (userStatus.status === UserStatus.LOGGED_OUT) {
      return null;
    }

    return userStatus;
  }
}
