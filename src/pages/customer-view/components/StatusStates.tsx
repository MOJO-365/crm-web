import React from 'react';
import { ActivityIcon } from '@/components/icons';

export const LoadingState: React.FC = () => (
    <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

export const ErrorState: React.FC = () => (
    <div className="h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ActivityIcon className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Not Found</h2>
            <p className="text-slate-600 mb-6">We couldn't find the application details you're looking for. Please check the link or contact our support team.</p>
            <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                Support: <a href="tel:1300707042" className="text-primary font-semibold">1300 707 042</a>
            </div>
        </div>
    </div>
);
