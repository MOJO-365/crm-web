import React from 'react';
import { CheckIcon } from '@/components/icons';

interface SuccessStepProps {
    customerIdDisplay: string;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ customerIdDisplay }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] p-6 font-sans">
            {/* Elegant subtle background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-50" />

            <div className="max-w-md w-full relative">
                {/* Decorative Ring */}
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

                <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-10 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        {/* Icon Wrapper */}
                        <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm border border-emerald-100/50">
                            <CheckIcon className="w-12 h-12 text-emerald-500" />
                        </div>

                        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">All set!</h2>
                        <p className="text-slate-500 mb-12 text-lg leading-relaxed">
                            Your application has been received and is currently being processed.
                        </p>

                        {/* Status Card */}
                        <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Application Reference</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{customerIdDisplay}</p>
                                </div>

                                <div className="h-px bg-slate-200/60 w-12 mx-auto" />

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Current Status</p>
                                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                        <span className="text-sm font-bold text-slate-700">Connection In Progress</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => window.close()}
                                className="w-full py-5 bg-slate-900 text-white font-bold rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                            >
                                Done
                            </button>
                            <p className="text-xs text-slate-400 font-medium">
                                You can safely close this window now.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
