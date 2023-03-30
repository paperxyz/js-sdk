export function isTestnet(chain: string) {
  switch (chain) {
    case 'Mumbai':
    case 'Goerli':
    case 'SolanaDevnet':
    case 'Rinkeby':
    case 'Ghostnet':
      return true;

    default:
      return false;
  }
}
