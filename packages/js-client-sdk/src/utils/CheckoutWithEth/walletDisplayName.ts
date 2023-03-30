export function walletDisplayName(connectorName: string) {
  switch (connectorName) {
    case 'MetaMask':
      return 'Metamask';
    case 'WalletConnectLegacy':
      return 'WalletConnect';
    case 'Coinbase Wallet':
      return 'Coinbase Wallet';
    default:
      return undefined;
  }
}
