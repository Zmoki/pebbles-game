import Web3 from 'web3';

const connectButton = document.getElementById('connectWallet')!;
const walletAddresses = document.getElementById('walletAddresses')!;

let web3: Web3 | undefined;
let isConnected = false;

function formatAddress(address: string): string {
  return `${address.substring(0, 4)}...${address.substring(address.length - 3)}`;
}

function showAddresses(addresses: string[]) {
  walletAddresses.innerHTML = (addresses.map(address => formatAddress(address))).join(', ');
}

function clearAddresses() {
  walletAddresses.innerHTML = '';
}

function toggleButton() {
  connectButton.innerText = isConnected ? 'Disconnect Wallet' : 'Connect Wallet';
}

async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      web3 = new Web3(window.ethereum);

      const accounts = await web3.eth.getAccounts();

      isConnected = true;
      showAddresses(accounts)
      toggleButton();
    } catch (error) {
      console.error("User denied account access or error occurred", error);
    }
  } else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
}

function disconnectWallet() {
  if (isConnected) {
    isConnected = false;
    clearAddresses();
    toggleButton();
  }
}

async function checkWalletConnection() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();

    if (accounts.length > 0) {
      showAddresses(accounts)

      isConnected = true;
      toggleButton();
    }
  } else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
}

checkWalletConnection();

connectButton.addEventListener('click', () => {
  if (isConnected) {
    disconnectWallet();
  } else {
    connectWallet();
  }
});
