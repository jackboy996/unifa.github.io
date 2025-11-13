/**
 * unifa.launch - Wallet Connection Module
 * Handles Phantom wallet integration for Solana
 */

// Global variables
let connectedWallet = null;
let walletProvider = null;

// DOM elements
const walletConnectBtn = document.getElementById('wallet-connect-btn');
const createTokenBtn = document.getElementById('create-token-btn');
const buyButtons = document.querySelectorAll('.buy-token-btn');

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Phantom wallet is installed
    checkPhantomInstallation();
    
    // Bind wallet connect button event
    if (walletConnectBtn) {
        walletConnectBtn.addEventListener('click', handleWalletConnect);
    }
    
    // Initially disable buttons that require wallet connection
    disableWalletRequiredButtons();
});

/**
 * Check if Phantom wallet is installed
 */
function checkPhantomInstallation() {
    if (window.solana && window.solana.isPhantom) {
        console.log('Phantom wallet detected');
        walletProvider = window.solana;
        
        // Listen for wallet events
        walletProvider.on('connect', (accounts) => {
            connectedWallet = accounts[0];
            handleWalletConnect();
        });
        
        walletProvider.on('disconnect', () => {
            connectedWallet = null;
            handleWalletDisconnect();
        });
        
        walletProvider.on('accountChanged', (accounts) => {
            if (accounts.length > 0) {
                connectedWallet = accounts[0];
                handleAccountChange();
            } else {
                handleWalletDisconnect();
            }
        });
        
        // Check if already connected
        if (walletProvider.isConnected) {
            connectedWallet = walletProvider.publicKey.toString();
            handleWalletConnect();
        }
    } else {
        console.log('Phantom wallet not detected');
        showNotification('Error', 'Please install Phantom wallet to continue', 'error');
        disableWalletConnectButton();
    }
}

/**
 * Handle wallet connection
 */
async function handleWalletConnect() {
    try {
        if (!walletProvider) {
            showNotification('Error', 'Phantom wallet not detected', 'error');
            return;
        }
        
        // If already connected, disconnect
        if (walletProvider.isConnected) {
            await walletProvider.disconnect();
            return;
        }
        
        // Request connection
        const accounts = await walletProvider.connect({ onlyIfTrusted: false });
        
        if (accounts.length > 0) {
            connectedWallet = accounts[0];
            console.log('Wallet connected:', connectedWallet);
            
            // Update UI
            updateWalletButtonUI(true);
            enableWalletRequiredButtons();
            
            // Show success notification
            showNotification('Success', 'Wallet connected successfully', 'success');
            
            // Load user data
            loadUserData();
        }
    } catch (error) {
        console.error('Wallet connection error:', error);
        showNotification('Error', 'Failed to connect wallet: ' + error.message, 'error');
    }
}

/**
 * Handle wallet disconnection
 */
function handleWalletDisconnect() {
    console.log('Wallet disconnected');
    connectedWallet = null;
    
    // Update UI
    updateWalletButtonUI(false);
    disableWalletRequiredButtons();
    
    // Show notification
    showNotification('Info', 'Wallet disconnected', 'info');
    
    // Clear user data
    clearUserData();
}

/**
 * Handle account change
 */
function handleAccountChange() {
    console.log('Account changed:', connectedWallet);
    
    // Update UI
    updateWalletButtonUI(true);
    
    // Show notification
    showNotification('Info', 'Account switched successfully', 'info');
    
    // Reload user data
    loadUserData();
}

/**
 * Update wallet button UI based on connection status
 * @param {boolean} isConnected - Whether wallet is connected
 */
function updateWalletButtonUI(isConnected) {
    if (!walletConnectBtn) return;
    
    if (isConnected && connectedWallet) {
        // Show connected state
        const truncatedAddress = truncateWalletAddress(connectedWallet);
        walletConnectBtn.innerHTML = `
            <i class="fa fa-wallet mr-2"></i>
            <span>${truncatedAddress}</span>
        `;
        walletConnectBtn.classList.remove('wallet-btn');
        walletConnectBtn.classList.add('wallet-connected', 'bg-gray-600', 'hover:bg-gray-700');
    } else {
        // Show connect button
        walletConnectBtn.innerHTML = `
            <i class="fa fa-wallet mr-2"></i>
            <span>Connect Wallet</span>
        `;
        walletConnectBtn.classList.remove('wallet-connected', 'bg-gray-600', 'hover:bg-gray-700');
        walletConnectBtn.classList.add('wallet-btn', 'bg-primary', 'hover:bg-accent');
    }
}

/**
 * Enable buttons that require wallet connection
 */
function enableWalletRequiredButtons() {
    if (createTokenBtn) {
        createTokenBtn.disabled = false;
    }
    
    buyButtons.forEach(btn => {
        btn.disabled = false;
    });
}

/**
 * Disable buttons that require wallet connection
 */
function disableWalletRequiredButtons() {
    if (createTokenBtn) {
        createTokenBtn.disabled = true;
    }
    
    buyButtons.forEach(btn => {
        btn.disabled = true;
    });
}

/**
 * Disable wallet connect button (when Phantom not installed)
 */
function disableWalletConnectButton() {
    if (!walletConnectBtn) return;
    
    walletConnectBtn.disabled = true;
    walletConnectBtn.innerHTML = `
        <i class="fa fa-exclamation-circle mr-2"></i>
        <span>Install Phantom</span>
    `;
    walletConnectBtn.classList.remove('bg-primary', 'hover:bg-accent');
    walletConnectBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
}

/**
 * Load user data from API
 */
function loadUserData() {
    console.log('Loading user data...');
    
    // Simulated data loading for creator
    if (document.getElementById('no-token-message')) {
        // In a real app, check if user has created tokens via API
        // For demo, just show progress after short delay
        setTimeout(() => {
            document.getElementById('no-token-message').classList.add('hidden');
            document.getElementById('token-progress').classList.remove('hidden');
        }, 1000);
    }
    
    // Simulated data loading for investor
    if (document.getElementById('no-purchases-message')) {
        // In a real app, check user purchases via API
        // For demo, show purchases after short delay
        setTimeout(() => {
            document.getElementById('no-purchases-message').classList.add('hidden');
            document.getElementById('purchases-list').classList.remove('hidden');
        }, 1500);
    }
}

/**
 * Clear user data when wallet disconnects
 */
function clearUserData() {
    console.log('Clearing user data...');
    
    // Hide creator progress
    if (document.getElementById('token-progress')) {
        document.getElementById('token-progress').classList.add('hidden');
    }
    
    if (document.getElementById('no-token-message')) {
        document.getElementById('no-token-message').classList.remove('hidden');
    }
    
    // Hide investor purchases
    if (document.getElementById('purchases-list')) {
        document.getElementById('purchases-list').classList.add('hidden');
    }
    
    if (document.getElementById('no-purchases-message')) {
        document.getElementById('no-purchases-message').classList.remove('hidden');
    }
}

/**
 * Truncate wallet address for display
 * @param {string} address - Full wallet address
 * @returns {string} Truncated address
 */
function truncateWalletAddress(address) {
    if (!address || address.length <= 10) return address;
    return address.substring(0, 4) + '...' + address.substring(address.length - 4);
}

/**
 * Show notification to user
 * @param {string} title - Notification title
 * @param {string} message - Notification content
 * @param {string} type - Notification type: success, error, warning, info
 */
function showNotification(title, message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.getElementById('notification-icon');
    const closeNotification = document.getElementById('close-notification');
    
    if (!notification || !notificationTitle || !notificationMessage) return;
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    // Set icon based on type
    if (notificationIcon) {
        if (type === 'success') {
            notificationIcon.className = 'flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3';
            notificationIcon.innerHTML = '<i class="fa fa-check text-green-600"></i>';
        } else if (type === 'error') {
            notificationIcon.className = 'flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3';
            notificationIcon.innerHTML = '<i class="fa fa-times text-red-600"></i>';
        } else if (type === 'warning') {
            notificationIcon.className = 'flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mr-3';
            notificationIcon.innerHTML = '<i class="fa fa-exclamation text-yellow-600"></i>';
        } else if (type === 'info') {
            notificationIcon.className = 'flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3';
            notificationIcon.innerHTML = '<i class="fa fa-info text-blue-600"></i>';
        }
    }
    
    // Show notification
    notification.classList.remove('translate-y-full', 'opacity-0');
    
    // Auto hide after 5 seconds
    const hideTimeout = setTimeout(() => {
        hideNotification();
    }, 5000);
    
    // Close button handler
    if (closeNotification) {
        closeNotification.onclick = () => {
            clearTimeout(hideTimeout);
            hideNotification();
        };
    }
    
    /**
     * Hide notification with animation
     */
    function hideNotification() {
        notification.classList.add('translate-y-full', 'opacity-0');
    }
}

// Export functions for other modules
window.WalletConnect = {
    isConnected: () => !!connectedWallet,
    getConnectedWallet: () => connectedWallet,
    connect: handleWalletConnect
};
    
