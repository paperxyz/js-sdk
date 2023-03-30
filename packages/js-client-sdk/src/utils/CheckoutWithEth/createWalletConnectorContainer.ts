export function createWalletConnectorContainer(id: string) {
  const connectWalletPage = document.createElement('div');
  connectWalletPage.id = id;
  connectWalletPage.style.padding = '2em';
  connectWalletPage.style.display = 'flex';
  connectWalletPage.style.flexDirection = 'column';
  connectWalletPage.style.gap = '0.7em';
  return connectWalletPage;
}
