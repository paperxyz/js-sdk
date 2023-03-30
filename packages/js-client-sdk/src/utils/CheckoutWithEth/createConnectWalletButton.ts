export function createConnectWalletButton(displayName: string) {
  const connectWalletButton = document.createElement('button');
  connectWalletButton.className = 'paper-js-sdk-connect-wallet-button';
  connectWalletButton.setAttribute(
    'style',
    `
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    background-color: #1f2937;
    color: #ffffff;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
    justify-content: flex-start;
    align-items: center;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    margin-bottom: 1rem;
    margin-right: 0.5rem;
    display: flex;
  `,
  );

  connectWalletButton.innerText = displayName;

  return connectWalletButton;
}
