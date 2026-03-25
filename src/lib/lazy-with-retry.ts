import React, { lazy, type ComponentType } from 'react';

/**
 * A wrapper around React.lazy that catches "Failed to fetch dynamically imported module" errors.
 * This error typically occurs when a new version of the app is deployed and the browser 
 * tries to load an old chunk that no longer exists on the server.
 * 
 * When this happens, we force a page reload to get the latest index.html and asset mapping.
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
    componentImport: () => Promise<{ default: T }>
) =>
    lazy(async () => {
        const pageHasAlreadyReloaded = window.sessionStorage.getItem('page-has-been-reloaded');

        try {
            return await componentImport();
        } catch (error: any) {
            // Check if the error is related to dynamic import failure
            const isDynamicImportError = 
                error?.message?.includes('Failed to fetch dynamically imported module') ||
                error?.name === 'TypeError' ||
                /loading chunk/i.test(error?.message || '');

            if (isDynamicImportError && !pageHasAlreadyReloaded) {
                // Mark that we've reloaded to prevent infinite loops
                window.sessionStorage.setItem('page-has-been-reloaded', 'true');
                console.warn('Dynamic import failed, forcing page reload...', error);
                window.location.reload();
                
                // Return a dummy component that does nothing while the page reloads
                return { default: (() => null) as any };
            }

            // If we've already reloaded once and it still fails, or it's a different error, throw it
            console.error('Lazy loading failed permanently:', error);
            throw error;
        }
    }) as unknown as React.LazyExoticComponent<T>;

/**
 * Clear the reload flag when the app successfully loads.
 * This should be called in a top-level component or effect.
 */
export const clearLazyRetryFlag = () => {
    window.sessionStorage.removeItem('page-has-been-reloaded');
};
