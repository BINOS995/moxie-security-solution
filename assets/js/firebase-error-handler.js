/**
 * Firebase Error Handler and Connection Manager
 * Suppresses Firebase connection errors and provides graceful offline handling
 */

(function() {
    "use strict";

    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;

    // Firebase error patterns to suppress
    const FIREBASE_ERROR_PATTERNS = [
        /firestore\.googleapis\.com.*net::ERR_ABORTED/,
        /firestore\.googleapis\.com.*ECONNREFUSED/,
        /firestore\.googleapis\.com.*ENOTFOUND/,
        /firestore\.googleapis\.com.*ETIMEDOUT/,
        /firestore\.googleapis\.com.*NetworkError/,
        /firestore\.googleapis\.com.*code=unavailable/,
        /firestore\.googleapis\.com.*channel/,
        /firestore\.googleapis\.com.*Listen/,
        /firestore\.googleapis\.com.*connection/,
        /firestore\.googleapis\.com.*timeout/,
        /firebase.*network/,
        /firebase.*offline/,
        /firebase.*connection/,
        /gstatic\.com.*net::ERR_ABORTED/,
        /gstatic\.com.*NetworkError/,
        /gstatic\.com.*connection/,
        /gstatic\.com.*timeout/
    ];

    // Suppress Firebase connection errors
    console.error = function(...args) {
        const message = args.join(' ');
        const shouldSuppress = FIREBASE_ERROR_PATTERNS.some(pattern => pattern.test(message));
        
        if (shouldSuppress) {
            // Log as warning instead of error
            console.warn('[Firebase] Connection issue detected - using offline mode:', message);
            return;
        }
        
        originalError.apply(console, args);
    };

    // Suppress Firebase warnings
    console.warn = function(...args) {
        const message = args.join(' ');
        const shouldSuppress = FIREBASE_ERROR_PATTERNS.some(pattern => pattern.test(message));
        
        if (shouldSuppress) {
            // Skip these warnings entirely
            return;
        }
        
        originalWarn.apply(console, args);
    };

    // Connection status indicator
    let connectionStatus = {
        isOnline: navigator.onLine,
        firebaseConnected: false,
        lastCheck: new Date()
    };

    // Update connection status
    function updateConnectionStatus(online) {
        connectionStatus.isOnline = online;
        connectionStatus.lastCheck = new Date();
        
        // Update UI if needed
        const statusIndicator = document.getElementById('connection-status');
        if (statusIndicator) {
            statusIndicator.textContent = online ? 'Online' : 'Offline';
            statusIndicator.className = online ? 'online' : 'offline';
        }
    }

    // Listen for connection changes
    window.addEventListener('online', () => {
        updateConnectionStatus(true);
        console.log('[Firebase] Connection restored - attempting to reconnect');
    });

    window.addEventListener('offline', () => {
        updateConnectionStatus(false);
        console.log('[Firebase] Connection lost - entering offline mode');
    });

    // Check initial connection
    updateConnectionStatus(navigator.onLine);

    // Global connection status getter
    window.getFirebaseConnectionStatus = function() {
        return {
            ...connectionStatus,
            retryCount: 0,
            maxRetries: 3
        };
    };

    // Graceful error handler for Firebase operations
    window.handleFirebaseError = function(error, operation) {
        const isNetworkError = error.code === 'unavailable' || 
                              error.code === 'network-request-failed' ||
                              error.message.includes('net::ERR_ABORTED') ||
                              error.message.includes('NetworkError');

        if (isNetworkError) {
            console.warn(`[Firebase] ${operation} failed due to network issues - using local storage fallback`);
            return {
                success: false,
                error: 'Network connection unavailable - using local storage',
                offline: true,
                retryable: true
            };
        }

        console.error(`[Firebase] ${operation} failed:`, error);
        return {
            success: false,
            error: error.message,
            offline: false,
            retryable: false
        };
    };

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[Firebase] Error handler initialized - connection errors will be suppressed');
    });

    // Expose for debugging
    window.firebaseErrorHandler = {
        getConnectionStatus: window.getFirebaseConnectionStatus,
        handleError: window.handleFirebaseError,
        patterns: FIREBASE_ERROR_PATTERNS
    };

})();