import type { Networkish } from "@ethersproject/providers";
import type {
  InitializedUser,
  PaperConstructorType,
} from "@paperxyz/embedded-wallet-service-sdk";
import {
  PaperEmbeddedWalletSdk,
  UserStatus,
} from "@paperxyz/embedded-wallet-service-sdk";
import type { Chain as InternalChain } from "@paperxyz/sdk-common-utilities";
import type { Signer, providers } from "ethers";
import type { Address, Chain, ConnectorData } from "wagmi";
import { Connector, UserRejectedRequestError } from "wagmi";
import {
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  fantom,
  fantomTestnet,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  sepolia,
} from "wagmi/chains";
import { ChainIdToChain } from "../../../sdk-common-utilities/src/constants/blockchain";

const IS_SERVER = typeof window === "undefined";

export type PaperEmbeddedWalletWagmiConnectorProps = {
  chains?: Chain[];
  options: {
    rpcEndpoint?: Networkish;
  } & PaperConstructorType;
};

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
  override readonly chains: Chain[];

  #sdk?: PaperEmbeddedWalletSdk;
  #paperOptions: PaperConstructorType;
  #provider?: providers.Provider;
  #user: InitializedUser | null;
  #rpcEndpoint?: Networkish;

  constructor(config: PaperEmbeddedWalletWagmiConnectorProps) {
    super(config);

    if (!config.options.clientId) {
      throw new Error(
        "No client ID provided. Provide your Paper Embedded Wallet client ID found in the Developer Dashboard.",
      );
    }

    this.#user = null;
    this.#paperOptions = config.options;
    this.#rpcEndpoint = config.options.rpcEndpoint;

    if (config.chains?.length) {
      this.chains = config.chains;

      // if the chains array doesnt include the default chain, add it.
      const wagmiChain: Chain = getChain(this.#paperOptions.chain);
      if (!this.chains.includes(wagmiChain)) {
        this.chains.push(wagmiChain);
      }
    } else {
      this.chains = [getChain(this.#paperOptions.chain)];
    }

    // Preload the SDK.
    if (typeof window !== "undefined") {
      this.getSdk();
    }
  }

  protected getSdk(): PaperEmbeddedWalletSdk {
    if (!this.#sdk) {
      this.#sdk = new PaperEmbeddedWalletSdk(this.#paperOptions);
    }
    return this.#sdk;
  }

  async getAccount(): Promise<Address> {
    const user = await this.getUser();
    if (!user) {
      throw new Error(`User is not logged in. Try calling "connect()" first.`);
    }
    const account = user.walletAddress;
    return account.startsWith("0x") ? (account as Address) : `0x${account}`;
  }

  async getProvider(_config?: {
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
    const signerOptions = this.#rpcEndpoint
      ? {
          rpcEndpoint: this.#rpcEndpoint,
        }
      : undefined;
    const signer = await user.wallet.getEthersJsSigner(signerOptions);
    return signer;
  }

  protected onAccountsChanged(accounts: Address[]): void {
    const account = accounts[0];
    if (!account) {
      this?.emit("disconnect");
    } else {
      this?.emit("change", { account });
    }
  }

  protected onDisconnect(_error: Error): void {
    this?.emit("disconnect");
  }

  async connect(): Promise<Required<ConnectorData>> {
    // If not authenticated, prompt the user to log in.
    const isAuthenticated = await this.isAuthorized();
    if (!isAuthenticated) {
      try {
        const resp = await this.getSdk().auth.loginWithPaperModal();
        if (resp.user.status !== UserStatus.LOGGED_IN_WALLET_INITIALIZED) {
          throw new Error(
            "Unexpected user status after logging in. Please try logging in again.",
          );
        }
      } catch (e) {
        throw new UserRejectedRequestError(e);
      }
    }

    const provider = await this.getProvider();
    provider.on("accountsChanged", this.onAccountsChanged);
    provider.on("chainChanged", this.onChainChanged);
    provider.on("disconnect", this.onDisconnect);

    const id = await this.getChainId();
    const account = await this.getAccount();
    return {
      provider,
      chain: {
        id,
        unsupported: false,
      },
      account,
    };
  }

  async getChainId(): Promise<number> {
    // getChaidId is called in the connect method. By default we will always connect to the
    // mandatory chain provided in the paperOptions argument.
    if (this.#paperOptions.chain) {
      return Promise.resolve(getChain(this.#paperOptions.chain).id);
    } else {
      throw new Error(
        "No default chain provided. Please provide at least one chain in the paperOptions argument. For example, paperOptions: {chain: 'Polygon'} ",
      );
    }
  }

  async isAuthorized() {
    const user = await this.getUser();
    return !!user;
  }

  async disconnect(): Promise<void> {
    await this.getSdk().auth.logout();
    this.#user = null;
  }

  protected onChainChanged(chainId: string | number): void {
    const id = Number(chainId);
    const unsupported = this.isChainUnsupported(id);
    this?.emit("change", { chain: { id, unsupported } });
  }

  async getUser(): Promise<InitializedUser | null> {
    if (!this.#user) {
      const userStatus = await this.getSdk().getUser();
      if (userStatus.status === UserStatus.LOGGED_IN_WALLET_INITIALIZED) {
        this.#user = userStatus;
      }
    }
    return this.#user;
  }

  override async switchChain(chainId: number): Promise<Chain> {
    const user = await this.getUser();
    if (!user) {
      throw new Error(`User is not logged in. Try calling "connect()" first.`);
    }

    const chainName = ChainIdToChain[chainId];
    if (chainName) {
      await user.wallet.setChain({ chain: chainName });
      this.onChainChanged(chainId);
      if (!user.walletAddress.startsWith("0x")) {
        throw "Invalid wallet address. Wallet address must start with 0x.";
      }
      this.onAccountsChanged([user.walletAddress as Address]);
      return getChain(chainName);
    } else {
      throw new Error(
        `Switching to the following chain with id: ${chainId} is not currently supported by Paper.`,
      );
    }
  }
}

export const getChain = (chain: InternalChain): Chain => {
  switch (chain) {
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
    case "Optimism":
      return optimism;
    case "OptimismGoerli":
      return optimismGoerli;
    case "BSC":
      return bsc;
    case "BSCTestnet":
      return bscTestnet;
    case "ArbitrumOne":
      return arbitrum;
    case "ArbitrumGoerli":
      return arbitrumGoerli;
    case "Fantom":
      return fantom;
    case "FantomTestnet":
      return fantomTestnet;
    case "Sepolia":
      return sepolia;
    case "AvalancheFuji":
      return avalancheFuji;
    default:
      throw new Error(
        `Unsupported chain. See https://docs.withpaper.com/reference/embedded-wallet-service-faq for supported chains.`,
      );
  }
};
