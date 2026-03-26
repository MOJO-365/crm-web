import React, { lazy, type ComponentType } from 'react';

/**
 * A wrapper around React.lazy that catches "Failed to fetch dynamically imported module" errors.
 * This error typically occurs when a new version of the app is deployed and the browser 
 * tries to load an old chunk that no longer exists on the server.
 * 
 * When this happens, we force a page reload to get the latest index.html and asset mapping.
 */

const RETRY_KEY = 'lazy-retry-timestamp';
const RETRY_TIMEOUT = 10000; // 10 seconds window for automatic retries

export const lazyWithRetry = <T extends ComponentType<any>>(
    componentImport: () => Promise<{ default: T }>
) =>
    lazy(async () => {
        const lastRetryStr = window.sessionStorage.getItem(RETRY_KEY);
        const now = Date.now();
        
        // Check if we already retried very recently to prevent infinite loops
        let hasRecentlyRetried = false;
        if (lastRetryStr) {
            const lastRetry = parseInt(lastRetryStr, 10);
            if (now - lastRetry < RETRY_TIMEOUT) {
                hasRecentlyRetried = true;
            }
        }

        try {
            const component = await componentImport();
            // If it succeeds, we can clear the retry flag if it exists
            if (lastRetryStr) {
                window.sessionStorage.removeItem(RETRY_KEY);
            }
            return component;
        } catch (error: any) {
            // Check if the error is related to dynamic import failure
            const errorMessage = error?.message || '';
            const errorName = error?.name || '';
            
            const isDynamicImportError = 
                errorMessage.includes('Failed to fetch dynamically imported module') ||
                errorMessage.includes('loading chunk') ||
                errorMessage.includes('Loading chunk') ||
                /failed to fetch/i.test(errorMessage) ||
                errorName === 'TypeError' ||
                errorName === 'ChunkLoadError' ||
                error?.code === 'CSS_CHUNK_LOAD_FAILED';

            if (isDynamicImportError && !hasRecentlyRetried) {
                // Mark the retry attempt with a timestamp
                window.sessionStorage.setItem(RETRY_KEY, now.toString());
                
                console.warn('Dynamic import failed, forcing page reload to fetch latest assets...', {
                    error,
                    url: window.location.href,
                    timestamp: new Date(now).toISOString()
                });
                
                // Force a reload without using the cache if possible
                window.location.reload();
                
                // Return a dummy component that does nothing while the page reloads
                return { default: (() => null) as any };
            }

            // If we've already retried recently or it's a different error, throw it
            console.error('Lazy loading failed permanently after retry or unknown error:', {
                error,
                hasRecentlyRetried,
                message: errorMessage
            });
            throw error;
        }
    }) as unknown as React.LazyExoticComponent<T>;

/**
 * Clear the retry flag when the app successfully loads.
 * This should be called in a top-level component or effect.
 */
export const clearLazyRetryFlag = () => {
    window.sessionStorage.removeItem(RETRY_KEY);
};
