// Solana Wallet Integration
let solanaConnection;
let solanaProvider;
let solanaPublicKey;
let walletConnectProvider;
let currentAccount;

// Wallet configurations
const SUPPORTED_SOLANA_NETWORKS = {
    mainnet: {
        name: "Solana Mainnet Beta",
        symbol: "SOL",
        rpcUrl: "https://api.mainnet-beta.solana.com"
    },
    devnet: {
        name: "Solana Devnet",
        symbol: "SOL",
        rpcUrl: "https://api.devnet.solana.com"
    },
    testnet: {
        name: "Solana Testnet",
        symbol: "SOL",
        rpcUrl: "https://api.testnet.solana.com"
    }
};

const DEFAULT_SOLANA_NETWORK = "devnet";

// Initialize Solana provider
function initSolana() {
    console.log("Initializing Solana...");
    
    // Check if Solana web3.js is loaded
    if (typeof solanaWeb3 === 'undefined') {
        console.error('Solana web3.js library is not loaded');
        showNotification('Failed to load required Solana libraries', 'error');
        return;
    }
    
    // Check if user has any Solana wallet installed
    if (window.phantom?.solana || window.solflare) {
        console.log("Solana wallet detected");
    } else {
        console.log("No Solana wallet detected");
        showNotification('No Solana wallet detected. Please install Phantom or another Solana wallet.', 'info');
    }
}

// Connect to specific wallet
async function connectWallet(walletType) {
    closeWalletModal();
    
    try {
        // All wallets connect to Solana by default
        switch (walletType) {
            case 'metamask':
                await connectMetaMask();
                break;
            case 'phantom':
                await connectPhantom();
                break;
            case 'solflare':
                await connectSolflare();
                break;
            case 'trust-wallet':
                await connectTrustWallet();
                break;
            case 'coinbase':
                await connectCoinbaseWallet();
                break;
            case 'wallet-connect':
                await connectSolanaWalletConnect();
                break;
            default:
                throw new Error(`Unsupported wallet type: ${walletType}`);
        }
    } catch (error) {
        console.error(`Error connecting to ${walletType}`, error);
        showNotification(`Failed to connect to wallet: ${error.message}`, 'error');
    }
}

// Connect to MetaMask
async function connectMetaMask() {
    console.log("Connecting to MetaMask...");
    
    // Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        console.error('ethers.js library is not loaded');
        throw new Error('ethers.js library is not loaded');
    }
    
    if (!window.ethereum) {
        console.error("MetaMask is not installed");
        throw new Error("MetaMask is not installed. Please install it from https://metamask.io/");
    }
    
    // Check if it's actually MetaMask
    if (window.ethereum.isMetaMask) {
        try {
            // First request account access
            console.log("Requesting account access...");
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Accounts granted:", accounts);
            
            if (!accounts || accounts.length === 0) {
                throw new Error("No accounts provided by wallet");
            }
            
            // Create provider
            console.log("Creating Web3Provider...");
            web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log("Web3Provider created:", web3Provider);
            
            // Check if we're on Solana network
            const chainId = await web3Provider.getNetwork().then(network => network.chainId);
            console.log("Current chain ID:", chainId);
            
            // Solana chain ID is 101
            if (chainId !== 101) {
                console.log("Switching to Solana network...");
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x65' }], // 101 in hex
                    });
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask
                    if (switchError.code === 4902) {
                        console.log("Adding Solana network to MetaMask...");
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x65',
                                        chainName: 'Solana',
                                        rpcUrls: ['https://api.mainnet-beta.solana.com'],
                                        nativeCurrency: {
                                            name: 'Solana',
                                            symbol: 'SOL',
                                            decimals: 18
                                        },
                                        blockExplorerUrls: ['https://explorer.solana.com/']
                                    }
                                ]
                            });
                        } catch (addError) {
                            console.error("Failed to add Solana network:", addError);
                            throw new Error("Failed to add Solana network to MetaMask. Please add it manually.");
                        }
                    } else {
                        console.error("Failed to switch to Solana network:", switchError);
                        throw new Error("Please switch to Solana network in MetaMask.");
                    }
                }
            }
            
            // Setup events
            setupWalletEvents();
            
            // Update account info
            await updateAccountInfo();
            
            return true;
        } catch (error) {
            console.error("MetaMask connection error:", error);
            throw new Error(`MetaMask connection failed: ${error.message}`);
        }
    } else {
        console.error("Not using MetaMask");
        throw new Error("Please use MetaMask wallet");
    }
}

// Connect to Solflare Wallet
async function connectSolflare() {
    console.log("Connecting to Solflare...");
    
    // Check if Solana web3.js is loaded
    if (typeof solanaWeb3 === 'undefined') {
        console.error('Solana web3.js is not loaded');
        throw new Error('Solana web3.js is not loaded');
    }
    
    // Check if Solflare is available
    if (!window.solflare) {
        // Try to open Solflare website if not installed
        window.open('https://solflare.com/', '_blank');
        throw new Error("Solflare wallet is not installed. Please install it from https://solflare.com/");
    }
    
    try {
        // Request connection
        const resp = await window.solflare.connect();
        console.log("Solflare connected:", resp);
        
        if (resp.publicKey) {
            solanaPublicKey = resp.publicKey;
            solanaProvider = window.solflare;
            
            // Create Solana connection
            solanaConnection = new solanaWeb3.Connection(
                SUPPORTED_SOLANA_NETWORKS[DEFAULT_SOLANA_NETWORK].rpcUrl,
                'confirmed'
            );
            
            // Update UI
            updateSolanaAccountInfo();
            
            // Set up event listeners
            solanaProvider.on('connect', () => {
                console.log('Solflare connected');
                updateSolanaAccountInfo();
            });
            
            solanaProvider.on('disconnect', () => {
                console.log('Solflare disconnected');
                disconnectWallet();
            });
            
            solanaProvider.on('accountChanged', (accounts) => {
                console.log('Solflare account changed:', accounts);
                if (accounts.length > 0) {
                    solanaPublicKey = accounts[0];
                    updateSolanaAccountInfo();
                } else {
                    disconnectWallet();
                }
            });
            
            return true;
        } else {
            throw new Error("No public key returned from Solflare");
        }
    } catch (error) {
        console.error("Solflare connection error:", error);
        throw new Error(`Solflare connection failed: ${error.message}`);
    }
}

// Connect to Solana via WalletConnect
async function connectSolanaWalletConnect() {
    console.log("Connecting to Solana via WalletConnect...");
    
    // Check if WalletConnect is available
    if (typeof WalletConnect === 'undefined') {
        throw new Error("WalletConnect not loaded");
    }
    
    // Create WalletConnect provider for Solana
    walletConnectProvider = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal,
        chainId: 101, // Solana chainId
    });
    
    // Check if connection is already established
    if (!walletConnectProvider.connected) {
        // Create session
        await walletConnectProvider.createSession({
            chainId: 101,
            rpc: {
                101: SUPPORTED_SOLANA_NETWORKS[DEFAULT_SOLANA_NETWORK].rpcUrl
            }
        });
    }
    
    // Set up event listeners
    walletConnectProvider.on("connect", (error, payload) => {
        if (error) {
            throw error;
        }
        
        // Get accounts
        const { accounts } = payload.params[0];
        if (accounts && accounts.length > 0) {
            solanaPublicKey = new solanaWeb3.PublicKey(accounts[0]);
            
            // Create Solana connection
            solanaConnection = new solanaWeb3.Connection(
                SUPPORTED_SOLANA_NETWORKS[DEFAULT_SOLANA_NETWORK].rpcUrl,
                'confirmed'
            );
            
            // Update UI
            updateSolanaAccountInfo();
        }
    });
    
    walletConnectProvider.on("session_update", (error, payload) => {
        if (error) {
            throw error;
        }
        
        // Get updated accounts
        const { accounts } = payload.params[0];
        if (accounts && accounts.length > 0) {
            solanaPublicKey = new solanaWeb3.PublicKey(accounts[0]);
            updateSolanaAccountInfo();
        } else {
            disconnectWallet();
        }
    });
    
    walletConnectProvider.on("disconnect", (error, payload) => {
        console.log("WalletConnect disconnected", error, payload);
        disconnectWallet();
    });
}

// Connect to Phantom (Solana)
async function connectPhantom() {
    console.log("Connecting to Phantom...");
    
    // Check if Solana web3.js is loaded
    if (typeof solanaWeb3 === 'undefined') {
        console.error('Solana web3.js is not loaded');
        throw new Error('Solana web3.js is not loaded');
    }
    
    // Check if Phantom is available
    if (!window.phantom?.solana) {
        console.error("Phantom is not installed");
        throw new Error("Phantom is not installed. Please install it from https://phantom.app/");
    }
    
    const provider = window.phantom.solana;
    
    // Check if it's actually Phantom
    if (provider.isPhantom) {
        try {
            // Request connection
            console.log("Requesting connection to Phantom...");
            const resp = await provider.connect();
            console.log("Phantom connected:", resp);
            
            if (resp.publicKey) {
                solanaPublicKey = resp.publicKey;
                solanaProvider = provider;
                
                // Create Solana connection
                solanaConnection = new solanaWeb3.Connection(
                    SUPPORTED_SOLANA_NETWORKS[DEFAULT_SOLANA_NETWORK].rpcUrl,
                    'confirmed'
                );
                
                // Update UI
                updateSolanaAccountInfo();
                
                // Set up event listeners
                provider.on('connect', () => {
                    console.log('Phantom connected');
                    updateSolanaAccountInfo();
                });
                
                provider.on('disconnect', () => {
                    console.log('Phantom disconnected');
                    disconnectWallet();
                });
                
                provider.on('accountChanged', (accounts) => {
                    console.log('Phantom account changed:', accounts);
                    if (accounts.length > 0) {
                        solanaPublicKey = accounts[0];
                        updateSolanaAccountInfo();
                    } else {
                        disconnectWallet();
                    }
                });
                
                return true;
            } else {
                throw new Error("No public key returned from Phantom");
            }
        } catch (error) {
            console.error("Phantom connection error:", error);
            throw new Error(`Phantom connection failed: ${error.message}`);
        }
    } else {
        console.error("Not using Phantom");
        throw new Error("Please use Phantom wallet");
    }
}

// Update Solana account information
async function updateSolanaAccountInfo() {
    console.log("Updating Solana account info...");
    
    if (!solanaPublicKey) {
        console.error("Solana public key is not available");
        return;
    }
    
    try {
        // Get balance
        const balance = await solanaConnection.getBalance(solanaPublicKey);
        const solBalance = solanaWeb3.LAMPORTS_PER_SOL;
        const formattedBalance = (balance / solBalance).toFixed(4);
        
        // Update UI
        try {
            const desktopAddressElement = document.getElementById('connected-address');
            const mobileAddressElement = document.getElementById('mobile-connected-address');
            
            if (desktopAddressElement) {
                desktopAddressElement.textContent = formatAddress(solanaPublicKey.toBase58());
            } else {
                console.error("Desktop address element not found");
            }
            
            if (mobileAddressElement) {
                mobileAddressElement.textContent = formatAddress(solanaPublicKey.toBase58());
            } else {
                console.error("Mobile address element not found");
            }
            
            // Show connected UI
            document.getElementById('wallet-connect-button').classList.add('hidden');
            document.getElementById('wallet-connected').classList.remove('hidden');
            document.getElementById('wallet-connected').classList.add('flex');
            
            document.getElementById('mobile-wallet-connect-button').classList.add('hidden');
            document.getElementById('mobile-wallet-connected').classList.remove('hidden');
            
            // Set current account for copy function
            currentAccount = solanaPublicKey.toBase58();
            
            // Show success message
            showNotification(`Connected to ${formatAddress(solanaPublicKey.toBase58())} (${formattedBalance} SOL)`);
        } catch (uiError) {
            console.error("Error updating UI:", uiError);
        }
    } catch (error) {
        console.error("Error updating Solana account info:", error);
        showNotification(`Failed to update account info: ${error.message}`, 'error');
    }
}

// Disconnect wallet
function disconnectWallet() {
    if (walletConnectProvider && walletConnectProvider.connected) {
        walletConnectProvider.killSession();
    }
    
    // Disconnect Solana wallet
    if (solanaProvider && solanaProvider.disconnect) {
        solanaProvider.disconnect();
    }
    
    solanaConnection = null;
    solanaProvider = null;
    solanaPublicKey = null;
    currentAccount = null;
    
    // Update UI
    document.getElementById('wallet-connect-button').classList.remove('hidden');
    document.getElementById('wallet-connected').classList.add('hidden');
    document.getElementById('wallet-connected').classList.remove('flex');
    document.getElementById('wallet-dropdown').classList.add('hidden');
    
    document.getElementById('mobile-wallet-connect-button').classList.remove('hidden');
    document.getElementById('mobile-wallet-connected').classList.add('hidden');
    
    // Show notification
    showNotification("Wallet disconnected");
}

// Show network information
function showNetwork() {
    const currentNetwork = SUPPORTED_SOLANA_NETWORKS[DEFAULT_SOLANA_NETWORK];
    
    let html = `<div class="p-4">
        <h3 class="font-bold mb-4">Network Information</h3>
        <div class="p-4 bg-dark-500 rounded-lg mb-4">
            <div class="flex items-center mb-3">
                <i class="fas fa-circle text-blue-400 mr-3"></i>
                <div>
                    <div class="font-medium">${currentNetwork.name}</div>
                    <div class="text-xs text-gray-400">${currentNetwork.rpcUrl}</div>
                </div>
            </div>
            <div class="text-sm">
                <div class="mb-2">
                    <span class="text-gray-400">Symbol:</span>
                    <span class="ml-2">${currentNetwork.symbol}</span>
                </div>
                <div>
                    <span class="text-gray-400">Gas Fees:</span>
                    <span class="ml-2">~$0.00025</span>
                </div>
            </div>
        </div>
        <p class="text-sm text-gray-400">
            All tokens on unifa.launch are deployed on Solana. Network selection is not available as we exclusively use Solana for all token launches.
        </p>
    </div>`;
    
    // Show in modal
    document.getElementById('wallet-modal-content').innerHTML = html;
    document.getElementById('wallet-modal').style.display = 'flex';
}

// Copy address to clipboard
function copyAddress() {
    let address;
    if (currentAccount) {
        address = currentAccount;
    } else if (solanaPublicKey) {
        address = solanaPublicKey.toBase58();
    }
    
    if (!address) return;
    
    navigator.clipboard.writeText(address)
        .then(() => {
            showNotification("Address copied to clipboard");
        })
        .catch(err => {
            console.error("Failed to copy address: ", err);
            showNotification("Failed to copy address", "error");
        });
}

// Toggle wallet dropdown
function toggleWalletDropdown() {
    const dropdown = document.getElementById('wallet-dropdown');
    dropdown.classList.toggle('hidden');
}

// Connect to Trust Wallet
async function connectTrustWallet() {
    console.log("Connecting to Trust Wallet...");
    throw new Error("Trust Wallet connection is not fully implemented yet");
}

// Connect to Coinbase Wallet
async function connectCoinbaseWallet() {
    console.log("Connecting to Coinbase Wallet...");
    throw new Error("Coinbase Wallet connection is not fully implemented yet");
}
