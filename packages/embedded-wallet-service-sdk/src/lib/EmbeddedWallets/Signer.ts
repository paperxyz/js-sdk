import type {
  Provider,
  TransactionRequest,
} from "@ethersproject/abstract-provider";
import type {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { Signer } from "@ethersproject/abstract-signer";
import type { Bytes } from "@ethersproject/bytes";
import type { Deferrable } from "@ethersproject/properties";
import { defineReadOnly } from "@ethersproject/properties";
import type { ClientIdWithQuerierType } from "../../interfaces/EmbeddedWallets/EmbeddedWallets";
import type {
  GetAddressReturnType,
  SignedTypedDataReturnType,
  SignMessageReturnType,
  SignTransactionReturnType,
} from "../../interfaces/EmbeddedWallets/Signer";

import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";

export type SignerProcedureTypes = {
  getAddress: void;
  signMessage: { message: string | Bytes; chainId: number | undefined };
  signTransaction: {
    transaction: Deferrable<TransactionRequest>;
    chainId: number | undefined;
  };
  signTypedDataV4: {
    domain: TypedDataDomain;
    types: Record<string, Array<TypedDataField>>;
    value: Record<string, unknown>;
    chainId: number | undefined;
  };
  connect: { provider: Provider };
};

export class EthersSigner extends Signer {
  protected querier: EmbeddedWalletIframeCommunicator<SignerProcedureTypes>;
  protected clientId: string;
  private DEFAULT_ETHEREUM_CHAIN_ID = 1;
  constructor({
    provider,
    clientId,
    querier,
  }: ClientIdWithQuerierType & {
    provider: Provider;
  }) {
    super();
    this.clientId = clientId;
    this.querier = querier;
    defineReadOnly(this, "provider", provider);
  }

  override async getAddress(): Promise<string> {
    const { address } = await this.querier.call<GetAddressReturnType>({
      procedureName: "getAddress",
      params: undefined,
    });
    return address;
  }

  override async signMessage(message: string | Bytes): Promise<string> {
    const { signedMessage } = await this.querier.call<SignMessageReturnType>({
      procedureName: "signMessage",
      params: {
        message,
        chainId:
          (await this.provider?.getNetwork())?.chainId ??
          this.DEFAULT_ETHEREUM_CHAIN_ID,
      },
    });
    return signedMessage;
  }

  override async signTransaction(
    transaction: TransactionRequest,
  ): Promise<string> {
    const { signedTransaction } =
      await this.querier.call<SignTransactionReturnType>({
        procedureName: "signTransaction",
        params: {
          transaction,
          chainId:
            (await this.provider?.getNetwork())?.chainId ??
            this.DEFAULT_ETHEREUM_CHAIN_ID,
        },
      });
    return signedTransaction;
  }

  async _signTypedData(
    domain: SignerProcedureTypes["signTypedDataV4"]["domain"],
    types: SignerProcedureTypes["signTypedDataV4"]["types"],
    message: SignerProcedureTypes["signTypedDataV4"]["value"],
  ): Promise<string> {
    const { signedTypedData } =
      await this.querier.call<SignedTypedDataReturnType>({
        procedureName: "signTypedDataV4",
        params: {
          domain,
          types,
          message,
          chainId:
            (await this.provider?.getNetwork())?.chainId ??
            this.DEFAULT_ETHEREUM_CHAIN_ID,
        },
      });
    return signedTypedData;
  }

  override connect(provider: Provider): EthersSigner {
    return new EthersSigner({
      clientId: this.clientId,
      provider,
      querier: this.querier,
    });
  }
}
