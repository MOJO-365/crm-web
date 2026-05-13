import React from 'react';
import MainLogo from '@/assets/main-logo-dark-1.png';
import { Button } from '@/components/ui';
import { ChevronLeftIcon } from '@/components/icons';

interface CustomerViewLayoutProps {
    children: React.ReactNode;
    footerButtonLabel?: string;
    onFooterButtonClick?: () => void;
    isFooterButtonDisabled?: boolean;
    isFooterButtonLoading?: boolean;
    footerButtonLoadingText?: string;
    showFooter?: boolean;
    onBack?: () => void;
    title?: string;
    subtitle?: string;
    footerContent?: React.ReactNode;
}

export const CustomerViewLayout: React.FC<CustomerViewLayoutProps> = ({
    children,
    footerButtonLabel,
    onFooterButtonClick,
    isFooterButtonDisabled,
    isFooterButtonLoading,
    footerButtonLoadingText,
    showFooter = true,
    onBack,
    title,
    subtitle,
    footerContent
}) => {
    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
            {/* Header Section - Shared */}
            <header className="flex-none bg-white border-b border-slate-100 py-6 px-4 flex justify-center items-center z-10 shadow-sm relative">
                <img src={MainLogo} alt="GEE Energy" className="h-10 md:h-12" />
            </header>

            {/* Main Content - Scrollable */}
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
                    {/* Optional Step Header */}
                    {(onBack || title) && (
                        <div className="flex items-center justify-between mb-4">
                            {onBack ? (
                                <button
                                    onClick={onBack}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                >
                                    <ChevronLeftIcon className="w-4 h-4" />
                                    Back
                                </button>
                            ) : <div className="w-12"></div>}
                            
                            {title && (
                                <div className="text-center">
                                    <h1 className="text-lg font-bold text-foreground">{title}</h1>
                                    {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                                </div>
                            )}
                            
                            <div className="w-12"></div>
                        </div>
                    )}

                    {children}
                </div>
            </main>

            {/* Footer Section - Shared Button Sizing */}
            {showFooter && (
                <footer className="flex-none bg-white border-t border-slate-100 p-6 md:p-8 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                    <div className="max-w-3xl mx-auto w-full space-y-6">
                        {footerContent}
                        {footerButtonLabel && (
                            <Button
                                fullWidth
                                size="lg"
                                className={`h-14 text-lg font-bold rounded-2xl transition-all duration-300 ${!isFooterButtonDisabled ? 'shadow-lg shadow-primary/20' : ''}`}
                                disabled={isFooterButtonDisabled}
                                isLoading={isFooterButtonLoading}
                                loadingText={footerButtonLoadingText || "Saving..."}
                                onClick={onFooterButtonClick}
                            >
                                {footerButtonLabel}
                            </Button>
                        )}
                    </div>
                </footer>
            )}
        </div>
    );
};
