import {
  ICustomizationOptions,
  Locale,
} from '../interfaces/CommonCheckoutElementTypes';

export class LinksManager {
  private link: URL;

  constructor(baseLink: URL) {
    this.link = baseLink;
  }

  addStylingOptions(options: ICustomizationOptions) {
    if (options.colorPrimary) {
      this.link.searchParams.set('colorPrimary', options.colorPrimary);
    }
    if (options.colorBackground) {
      this.link.searchParams.set('colorBackground', options.colorBackground);
    }
    if (options.colorText) {
      this.link.searchParams.set('colorText', options.colorText);
    }
    if (options.borderRadius !== undefined) {
      this.link.searchParams.set(
        'borderRadius',
        options.borderRadius.toString(),
      );
    }
    if (options.fontFamily) {
      this.link.searchParams.set('fontFamily', options.fontFamily);
    }
  }

  addClientSecret(sdkClientSecret: string) {
    this.link.searchParams.set('sdkClientSecret', sdkClientSecret);
  }

  addLocale(locale?: Locale) {
    this.link.searchParams.set(
      'locale',
      locale?.toString() || Locale.EN.toString(),
    );
  }

  addOTP() {
    this.link.searchParams.set('withOTP', 'true');
  }

  addAppName(appName?: string) {
    if (appName) {
      this.link.searchParams.set('appName', appName);
    }
  }

  addShowConnectWalletOptions(showConnectWalletOptions: boolean) {
    this.link.searchParams.append(
      'showConnectWalletOptions',
      showConnectWalletOptions.toString(),
    );
  }

  addReceivingWalletType(walletType?: string) {
    this.link.searchParams.append('walletType', walletType || 'Preset');
  }

  addRecipientWalletAddress(address: string) {
    this.link.searchParams.set('recipientWalletAddress', address);
  }

  addPayerWalletAddress(address: string) {
    this.link.searchParams.append('payerWalletAddress', address);
  }

  addDate(date?: Date) {
    this.link.searchParams.set(
      'date',
      date ? date.toString() : Date.now().toString(),
    );
  }

  getLink(): URL {
    return this.link;
  }
}
