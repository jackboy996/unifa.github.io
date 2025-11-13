/**
 * Solana 402 Launchpad - Wallet Connect Module
 * 实现Phantom钱包连接功能
 */

// 全局变量
let connectedWallet = null;
let walletProvider = null;

// DOM元素
const walletConnectBtn = document.getElementById('wallet-connect-btn');
const createTokenBtn = document.getElementById('create-token-btn');
const buyButtons = document.querySelectorAll('.buy-token-btn');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否已安装Phantom钱包
    checkPhantomInstallation();
    
    // 绑定钱包连接按钮事件
    if (walletConnectBtn) {
        walletConnectBtn.addEventListener('click', handleWalletConnect);
    }
    
    // 初始禁用需要钱包连接的按钮
    disableWalletRequiredButtons();
});

/**
 * 检查Phantom钱包是否已安装
 */
function checkPhantomInstallation() {
    if (window.solana && window.solana.isPhantom) {
        console.log('Phantom钱包已安装');
        walletProvider = window.solana;
        
        // 监听钱包连接状态变化
        walletProvider.on('connect', handleWalletConnect);
        walletProvider.on('disconnect', handleWalletDisconnect);
        walletProvider.on('accountChanged', handleAccountChange);
        
        // 检查是否已连接
        if (walletProvider.isConnected) {
            handleWalletConnect();
        }
    } else {
        console.log('未检测到Phantom钱包');
        showNotification('错误', '请安装Phantom钱包后再试', 'error');
        disableWalletConnectButton();
    }
}

/**
 * 处理钱包连接
 */
async function handleWalletConnect() {
    try {
        if (!walletProvider) {
            showNotification('错误', '未检测到Phantom钱包', 'error');
            return;
        }
        
        // 如果已连接，则断开连接
        if (walletProvider.isConnected) {
            await walletProvider.disconnect();
            return;
        }
        
        // 请求连接钱包
        const accounts = await walletProvider.connect();
        
        if (accounts.length > 0) {
            connectedWallet = accounts[0];
            console.log('钱包已连接:', connectedWallet);
            
            // 更新UI
            updateWalletButtonUI(true);
            enableWalletRequiredButtons();
            
            // 显示成功通知
            showNotification('成功', '钱包已连接', 'success');
            
            // 加载用户数据
            loadUserData();
        }
    } catch (error) {
        console.error('钱包连接失败:', error);
        showNotification('错误', '钱包连接失败: ' + error.message, 'error');
    }
}

/**
 * 处理钱包断开连接
 */
function handleWalletDisconnect() {
    console.log('钱包已断开连接');
    connectedWallet = null;
    
    // 更新UI
    updateWalletButtonUI(false);
    disableWalletRequiredButtons();
    
    // 显示通知
    showNotification('信息', '钱包已断开连接', 'info');
    
    // 清除用户数据
    clearUserData();
}

/**
 * 处理账户切换
 */
function handleAccountChange(accounts) {
    if (accounts.length > 0) {
        connectedWallet = accounts[0];
        console.log('账户已切换:', connectedWallet);
        
        // 更新UI
        updateWalletButtonUI(true);
        
        // 显示通知
        showNotification('信息', '账户已切换', 'info');
        
        // 重新加载用户数据
        loadUserData();
    } else {
        handleWalletDisconnect();
    }
}

/**
 * 更新钱包按钮UI
 * @param {boolean} isConnected - 是否已连接
 */
function updateWalletButtonUI(isConnected) {
    if (!walletConnectBtn) return;
    
    if (isConnected && connectedWallet) {
        // 显示已连接状态
        const truncatedAddress = truncateWalletAddress(connectedWallet);
        walletConnectBtn.innerHTML = `
            <i class="fa fa-wallet"></i>
            <span>${truncatedAddress}</span>
        `;
        walletConnectBtn.classList.remove('wallet-btn');
        walletConnectBtn.classList.add('wallet-connected');
    } else {
        // 显示连接按钮
        walletConnectBtn.innerHTML = `
            <i class="fa fa-wallet"></i>
            <span>连接钱包</span>
        `;
        walletConnectBtn.classList.remove('wallet-connected');
        walletConnectBtn.classList.add('wallet-btn');
    }
}

/**
 * 启用需要钱包连接的按钮
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
 * 禁用需要钱包连接的按钮
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
 * 禁用钱包连接按钮
 */
function disableWalletConnectButton() {
    if (!walletConnectBtn) return;
    
    walletConnectBtn.disabled = true;
    walletConnectBtn.innerHTML = `
        <i class="fa fa-exclamation-circle"></i>
        <span>请安装Phantom钱包</span>
    `;
}

/**
 * 加载用户数据
 * 在实际应用中，这里会从API获取用户的代币和购买记录
 */
function loadUserData() {
    console.log('加载用户数据...');
    
    // 模拟加载创作者数据
    if (document.getElementById('no-token-message')) {
        // 在实际应用中，这里会检查用户是否有创建的代币
        // 这里简单模拟显示进度卡片
        // document.getElementById('no-token-message').classList.add('hidden');
        // document.getElementById('token-progress').classList.remove('hidden');
    }
    
    // 模拟加载投资者数据
    if (document.getElementById('no-purchases-message')) {
        // 在实际应用中，这里会检查用户是否有购买记录
        // 这里简单模拟显示购买记录
        // document.getElementById('no-purchases-message').classList.add('hidden');
        // document.getElementById('purchases-list').classList.remove('hidden');
    }
}

/**
 * 清除用户数据
 */
function clearUserData() {
    console.log('清除用户数据...');
    
    // 隐藏创作者进度卡片
    if (document.getElementById('token-progress')) {
        document.getElementById('token-progress').classList.add('hidden');
    }
    
    if (document.getElementById('no-token-message')) {
        document.getElementById('no-token-message').classList.remove('hidden');
    }
    
    // 隐藏投资者购买记录
    if (document.getElementById('purchases-list')) {
        document.getElementById('purchases-list').classList.add('hidden');
    }
    
    if (document.getElementById('no-purchases-message')) {
        document.getElementById('no-purchases-message').classList.remove('hidden');
    }
}

/**
 * 截断钱包地址显示
 * @param {string} address - 完整钱包地址
 * @returns {string} 截断后的地址
 */
function truncateWalletAddress(address) {
    if (!address || address.length <= 10) return address;
    return address.substring(0, 4) + '...' + address.substring(address.length - 4);
}

/**
 * 显示通知
 * @param {string} title - 通知标题
 * @param {string} message - 通知内容
 * @param {string} type - 通知类型：success, error, warning, info
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
    
    // 设置图标基于类型
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
    
    // 显示通知
    notification.classList.remove('translate-y-full', 'opacity-0');
    
    // 5秒后自动隐藏
    const hideTimeout = setTimeout(() => {
        hideNotification();
    }, 5000);
    
    // 关闭按钮
    if (closeNotification) {
        closeNotification.onclick = () => {
            clearTimeout(hideTimeout);
            hideNotification();
        };
    }
    
    function hideNotification() {
        notification.classList.add('translate-y-full', 'opacity-0');
    }
}

// 导出函数以便其他模块使用
window.WalletConnect = {
    isConnected: () => !!connectedWallet,
    getConnectedWallet: () => connectedWallet,
    connect: handleWalletConnect
};
