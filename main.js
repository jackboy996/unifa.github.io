// Main application logic

// DOM Elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const walletModal = document.getElementById('wallet-modal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    if(mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // Initialize wallet modal
    initWalletModal();
    
    // Initialize page navigation
    initPageNavigation();
    
    // Initialize token creator
    initTokenCreator();
    
    // Initialize DAO sections
    initDAOSections();
});

// Mobile menu toggle
function toggleMobileMenu() {
    if(mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Initialize wallet modal
function initWalletModal() {
    // Close wallet modal when clicking outside
    window.addEventListener('click', function(event) {
        if(walletModal && event.target === walletModal) {
            closeWalletModal();
        }
    });
}

// Open wallet modal
function openWalletModal() {
    if(walletModal) {
        // Reset modal content
        const modalContent = document.getElementById('wallet-modal-content');
        if(modalContent) {
            modalContent.innerHTML = `
                <div class="p-4">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-bold">Connect Wallet</h3>
                        <div class="bg-primary-500 bg-opacity-20 text-primary-500 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                            <i class="fas fa-circle text-blue-400 mr-1"></i> Solana Network
                        </div>
                    </div>
                    
                    <p class="text-gray-300 text-sm mb-6">
                        All tokens on unifa.launch are deployed on Solana. Please connect your Solana wallet to continue.
                    </p>
                    
                    <div class="space-y-4">
                        <!-- Phantom -->
                        <div class="p-4 bg-dark-500 rounded-lg cursor-pointer hover:bg-gradient-to-r from-primary-500/10 to-secondary-500/10 transition-all duration-300 flex items-center border border-primary-500/20 hover:border-primary-500/50 transform hover:-translate-y-1">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-4 shadow-lg shadow-blue-500/20">
                                <i class="fas fa-user-circle text-white text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <div class="font-medium text-lg">Phantom</div>
                                    <span class="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">Recommended</span>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">Most popular Solana wallet with browser extension</div>
                            </div>
                        </div>
                        
                        <!-- Solflare -->
                        <div class="p-4 bg-dark-500 rounded-lg cursor-pointer hover:bg-gradient-to-r from-primary-500/10 to-secondary-500/10 transition-all duration-300 flex items-center border border-primary-500/20 hover:border-primary-500/50 transform hover:-translate-y-1">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mr-4 shadow-lg shadow-green-500/20">
                                <i class="fas fa-mobile-alt text-white text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <div class="font-medium text-lg">Solflare</div>
                                    <span class="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">Mobile & Extension</span>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">Secure Solana wallet with mobile and browser support</div>
                            </div>
                        </div>
                        
                        <!-- WalletConnect -->
                        <div class="p-4 bg-dark-500 rounded-lg cursor-pointer hover:bg-gradient-to-r from-primary-500/10 to-secondary-500/10 transition-all duration-300 flex items-center border border-primary-500/20 hover:border-primary-500/50 transform hover:-translate-y-1">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mr-4 shadow-lg shadow-purple-500/20">
                                <i class="fas fa-qrcode text-white text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <div class="font-medium text-lg">WalletConnect</div>
                                    <span class="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">Universal</span>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">Connect any Solana-compatible wallet via QR code</div>
                            </div>
                        </div>
                        
                        <!-- MetaMask -->
                        <div class="p-4 bg-dark-500 rounded-lg cursor-pointer hover:bg-gradient-to-r from-primary-500/10 to-secondary-500/10 transition-all duration-300 flex items-center border border-primary-500/20 hover:border-primary-500/50 transform hover:-translate-y-1">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mr-4 shadow-lg shadow-orange-500/20">
                                <i class="fab fa-metamask text-white text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <div class="font-medium text-lg">MetaMask</div>
                                    <span class="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full">Ethereum Wallet</span>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">Popular Ethereum wallet with Solana compatibility</div>
                            </div>
                        </div>
                        
                        <!-- Trust Wallet -->
                        <div class="p-4 bg-dark-500 rounded-lg cursor-pointer hover:bg-gradient-to-r from-primary-500/10 to-secondary-500/10 transition-all duration-300 flex items-center border border-primary-500/20 hover:border-primary-500/50 transform hover:-translate-y-1">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-4 shadow-lg shadow-blue-600/20">
                                <i class="fas fa-shield-alt text-white text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <div class="font-medium text-lg">Trust Wallet</div>
                                    <span class="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full">Multi-Chain</span>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">Multi-chain wallet with Solana support</div>
                            </div>
                        </div>
                        
                        <!-- Coinbase Wallet -->
                        <div class="p-4 bg-dark-500 rounded-lg cursor-pointer hover:bg-gradient-to-r from-primary-500/10 to-secondary-500/10 transition-all duration-300 flex items-center border border-primary-500/20 hover:border-primary-500/50 transform hover:-translate-y-1">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-4 shadow-lg shadow-gray-700/20">
                                <i class="fab fa-coinbase text-white text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <div class="font-medium text-lg">Coinbase Wallet</div>
                                    <span class="bg-gray-700/20 text-gray-400 text-xs px-2 py-1 rounded-full">Exchange Wallet</span>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">Wallet from Coinbase with Solana support</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-8 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg border border-primary-500/20">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-info-circle text-primary-500 mr-2"></i>
                            <h4 class="font-bold">Need a Solana Wallet?</h4>
                        </div>
                        <p class="text-gray-300 text-sm mb-4">
                            Install Phantom, the most popular Solana wallet, to get started.
                        </p>
                        <div class="mt-4 flex justify-center">
                            <a href="https://phantom.app" target="_blank" class="btn-primary transform hover:scale-105 transition-transform">
                                <i class="fas fa-download mr-2"></i> Download Phantom
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listeners
            setTimeout(() => {
                // Phantom
                const phantomOption = modalContent.querySelectorAll('.p-4.bg-dark-500')[0];
                if (phantomOption) {
                    phantomOption.addEventListener('click', () => connectWallet('phantom'));
                }
                
                // Solflare
                const solflareOption = modalContent.querySelectorAll('.p-4.bg-dark-500')[1];
                if (solflareOption) {
                    solflareOption.addEventListener('click', () => connectWallet('solflare'));
                }
                
                // WalletConnect
                const walletConnectOption = modalContent.querySelectorAll('.p-4.bg-dark-500')[2];
                if (walletConnectOption) {
                    walletConnectOption.addEventListener('click', () => connectWallet('wallet-connect'));
                }
                
                // MetaMask
                const metamaskOption = modalContent.querySelectorAll('.p-4.bg-dark-500')[3];
                if (metamaskOption) {
                    metamaskOption.addEventListener('click', () => connectWallet('metamask'));
                }
                
                // Trust Wallet
                const trustWalletOption = modalContent.querySelectorAll('.p-4.bg-dark-500')[4];
                if (trustWalletOption) {
                    trustWalletOption.addEventListener('click', () => connectWallet('trust-wallet'));
                }
                
                // Coinbase Wallet
                const coinbaseOption = modalContent.querySelectorAll('.p-4.bg-dark-500')[5];
                if (coinbaseOption) {
                    coinbaseOption.addEventListener('click', () => connectWallet('coinbase'));
                }
            }, 100);
        }
        
        walletModal.style.display = 'flex';
    }
}

// Close wallet modal
function closeWalletModal() {
    if(walletModal) {
        walletModal.style.display = 'none';
    }
}

// Initialize page navigation
function initPageNavigation() {
    // Handle URL hash
    const hash = window.location.hash.substring(1);
    if(hash && document.getElementById(hash)) {
        showPage(hash);
    } else {
        showPage('home-page');
    }
}

// Show specific page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(pageId).classList.add('active');
    
    // Update URL
    window.history.pushState({}, '', `#${pageId}`);
}

// Show project details
function showProjectDetails(projectId) {
    showPage('project-details-page');
    // Here you would typically load project-specific data
    console.log(`Showing details for project: ${projectId}`);
}

// Initialize token creator
function initTokenCreator() {
    // Token creator steps are handled in the HTML with nextStep and prevStep functions
}

// Token creator steps
function nextStep(currentStep) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep + 1}`).classList.add('active');
    
    // Update step indicator
    document.querySelectorAll('.step-item')[currentStep].classList.add('active');
    document.querySelectorAll('.step-item')[currentStep - 1].classList.add('completed');
}

function prevStep(currentStep) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep - 1}`).classList.add('active');
    
    // Update step indicator
    document.querySelectorAll('.step-item')[currentStep - 1].classList.remove('active');
}

// Add milestone
function addMilestone() {
    const milestonesContainer = document.getElementById('milestones-container');
    const milestoneCount = milestonesContainer.children.length + 1;
    
    const milestoneHTML = `
        <div class="milestone-item p-6 bg-dark-500 rounded-lg mb-4">
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-medium">Milestone ${milestoneCount}</h4>
                <button class="text-gray-400 hover:text-white" onclick="removeMilestone(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-400 text-sm mb-2">Title</label>
                    <input type="text" class="input-field" placeholder="e.g. Prototype Development">
                </div>
                
                <div>
                    <label class="block text-gray-400 text-sm mb-2">Funding</label>
                    <div class="relative">
                        <input type="text" class="input-field pl-8" placeholder="0">
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            $
                        </div>
                    </div>
                </div>
                
                <div>
                    <label class="block text-gray-400 text-sm mb-2">Deadline</label>
                    <input type="date" class="input-field">
                </div>
                
                <div>
                    <label class="block text-gray-400 text-sm mb-2">Completion Criteria</label>
                    <select class="input-field">
                        <option>Community Vote</option>
                        <option>Team Confirmation</option>
                        <option>Smart Contract Verification</option>
                    </select>
                </div>
                
                <div class="md:col-span-2">
                    <label class="block text-gray-400 text-sm mb-2">Description</label>
                    <textarea class="input-field" rows="3" placeholder="Describe what will be delivered..."></textarea>
                </div>
            </div>
        </div>
    `;
    
    milestonesContainer.insertAdjacentHTML('beforeend', milestoneHTML);
}

// Remove milestone
function removeMilestone(element) {
    const milestoneItem = element.closest('.milestone-item');
    milestoneItem.remove();
    
    // Reorder milestones
    const milestones = document.querySelectorAll('.milestone-item');
    milestones.forEach((milestone, index) => {
        milestone.querySelector('h4').textContent = `Milestone ${index + 1}`;
    });
}

// Deploy token
function deployToken() {
    document.getElementById('step-4').classList.remove('active');
    document.getElementById('deployment-success').classList.add('active');
    
    // Update step indicator
    document.querySelectorAll('.step-item')[3].classList.add('completed');
}

// Reset token creator
function resetTokenCreator() {
    document.getElementById('deployment-success').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
    
    // Reset step indicator
    document.querySelectorAll('.step-item').forEach((item, index) => {
        if(index === 0) {
            item.classList.add('active');
            item.classList.remove('completed');
        } else {
            item.classList.remove('active');
            item.classList.remove('completed');
        }
    });
}

// Initialize DAO sections
function initDAOSections() {
    // DAO sections are handled in the HTML with showDAOSection function
}

// DAO sections
function showDAOSection(sectionId) {
    document.querySelectorAll('.dao-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(`${sectionId}-section`).classList.remove('hidden');
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
        type === 'success' ? 'bg-success-500' : 'bg-danger-500'
    }`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.classList.add('opacity-90');
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
        notification.classList.remove('opacity-90');
        notification.classList.add('opacity-0');
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Format address for display
function formatAddress(address) {
    if (!address) return "0x...";
    
    // Check if it's a Solana address (longer than 42 characters)
    if (address.length > 42) {
        return address.substring(0, 4) + "..." + address.substring(address.length - 4);
    }
    
    return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}
