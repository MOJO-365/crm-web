import React, { useState, useEffect, useRef } from 'react';
import { PencilIcon, ChevronDownIcon } from '@/components/icons';
import { CustomerViewLayout } from './CustomerViewLayout';
import { apiAxios } from '@/lib/apollo';

async function loadSignaturePad(): Promise<void> {
    if ((window as any).SignaturePad) return;
    await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src =
            'https://cdn.jsdelivr.net/npm/signature_pad@4.1.5/dist/signature_pad.umd.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load SignaturePad'));
        document.head.appendChild(script);
    });
}

function extractBase64(dataUrl?: string | null): string | null {
    if (!dataUrl) return null;
    const [, base64] = dataUrl.split(',');
    return base64 || null;
}

interface NominationStepProps {
    isNominationConfirmed: boolean;
    setIsNominationConfirmed: (confirmed: boolean) => void;
    onBack: () => void;
    onNext: (signatureBase64: string) => void;
    signatoryName: string;
    uid?: string;
}

export const NominationStep: React.FC<NominationStepProps> = ({
    isNominationConfirmed,
    setIsNominationConfirmed,
    onBack,
    onNext,
    signatoryName,
    uid
}) => {
    const [signatureError, setSignatureError] = useState<string | null>(null);
    const [padReady, setPadReady] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Accordion state
    const [isOfferExpanded, setIsOfferExpanded] = useState(false);
    const [isNominationExpanded, setIsNominationExpanded] = useState(false);
    const [isOfferLoading, setIsOfferLoading] = useState(true);
    const [isNominationLoading, setIsNominationLoading] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sigPadRef = useRef<any>(null);

    // Initialize Signature Pad (Draw only) when modal opens
    useEffect(() => {
        if (!isModalOpen) return;

        let active = true;

        const initPad = async () => {
            await loadSignaturePad();
            if (!active) return;

            setTimeout(() => {
                if (canvasRef.current && (window as any).SignaturePad) {
                    const canvas = canvasRef.current;
                    const ratio = Math.max(window.devicePixelRatio || 1, 1);
                    canvas.width = canvas.offsetWidth * ratio;
                    canvas.height = canvas.offsetHeight * ratio;
                    canvas.getContext('2d')?.scale(ratio, ratio);

                    const pad = new (window as any).SignaturePad(canvas, {
                        minWidth: 2,
                        maxWidth: 4
                    });
                    pad.clear();
                    sigPadRef.current = pad;
                    setPadReady(true);

                    const handleResize = () => {
                        if (canvasRef.current) {
                            const c = canvasRef.current;
                            c.width = c.offsetWidth * ratio;
                            c.height = c.offsetHeight * ratio;
                            c.getContext('2d')?.scale(ratio, ratio);
                            pad.clear();
                        }
                    };
                    window.addEventListener('resize', handleResize);
                    (pad as any)._resizeHandler = handleResize;
                }
            }, 300);
        };
        initPad().catch(err => {
            console.error('Failed to load signature pad', err);
        });

        return () => {
            active = false;
            setPadReady(false);
            if (sigPadRef.current) {
                if ((sigPadRef.current as any)._resizeHandler) {
                    window.removeEventListener('resize', (sigPadRef.current as any)._resizeHandler);
                }
                sigPadRef.current.off();
                sigPadRef.current = null;
            }
        };
    }, [isModalOpen]);

    const handleNext = () => {
        setSignatureError(null);

        if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
            setSignatureError('Please sign in the box above.');
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            setSignatureError('Signature canvas not available.');
            return;
        }

        const dataUrl = canvas.toDataURL();
        const base64 = extractBase64(dataUrl);
        if (!base64) {
            setSignatureError('Failed to generate signature image.');
            return;
        }

        onNext(base64);
    };

    const canProceed = isNominationConfirmed;

    return (
        <>
            <CustomerViewLayout
                title="Nomination Form"
                subtitle="Please review and confirm your nomination"
                onBack={onBack}
                footerButtonLabel="Sign"
                onFooterButtonClick={() => setIsModalOpen(true)}
                isFooterButtonDisabled={!canProceed}
            >
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                    <div className="flex flex-col gap-5 w-full">
                        {/* Offer Summary Accordion */}
                        {uid && (
                            <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isOfferExpanded ? 'border-primary/40 ring-4 ring-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                                <button
                                    onClick={() => {
                                        setIsOfferExpanded(!isOfferExpanded);
                                        if (!isOfferExpanded) setIsOfferLoading(true);
                                    }}
                                    className={`w-full flex items-center justify-between px-6 py-5 transition-colors ${isOfferExpanded ? 'bg-primary/5' : 'bg-white hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOfferExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`font-bold text-base transition-colors ${isOfferExpanded ? 'text-primary' : 'text-slate-800'}`}>Offer Summary</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">Review your energy rates and plan details</p>
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOfferExpanded ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                        <ChevronDownIcon size={20} className={`transition-transform duration-300 ${isOfferExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                {isOfferExpanded && (
                                    <div className="border-t border-primary/10 bg-slate-50 p-2 sm:p-4">
                                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white relative aspect-[1/1.414] md:aspect-auto md:h-[700px] shadow-inner">
                                            {isOfferLoading && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 gap-3">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary" />
                                                    <p className="text-sm text-slate-500 font-medium">Loading preview...</p>
                                                </div>
                                            )}
                                            <iframe
                                                src={`${apiAxios.defaults.baseURL?.replace(/\/$/, '') || ''}/agreement/preview/${uid}?format=pdf#view=Fit`}
                                                className="absolute inset-0 w-full h-full border-0"
                                                title="Offer Summary Preview"
                                                onLoad={() => setIsOfferLoading(false)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PDF Preview Accordion */}
                        <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isNominationExpanded ? 'border-primary/40 ring-4 ring-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                            <button
                                onClick={() => {
                                    setIsNominationExpanded(!isNominationExpanded);
                                    if (!isNominationExpanded) setIsNominationLoading(true);
                                }}
                                className={`w-full flex items-center justify-between px-6 py-5 transition-colors ${isNominationExpanded ? 'bg-primary/5' : 'bg-white hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isNominationExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className={`font-bold text-base transition-colors ${isNominationExpanded ? 'text-primary' : 'text-slate-800'}`}>Nomination Form</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Read and agree to the nomination terms</p>
                                    </div>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isNominationExpanded ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                    <ChevronDownIcon size={20} className={`transition-transform duration-300 ${isNominationExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            {isNominationExpanded && (
                                <div className="border-t border-primary/10 bg-slate-50 p-2 sm:p-4">
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white relative aspect-[1/1.414] md:aspect-auto md:h-[700px] shadow-inner">
                                        {isNominationLoading && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 gap-3">
                                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary" />
                                                <p className="text-sm text-slate-500 font-medium">Loading preview...</p>
                                            </div>
                                        )}
                                        <iframe
                                            src={`${apiAxios.defaults.baseURL?.replace(/\/$/, '') || ''}/agreement/nomination-preview/${uid}?format=pdf#view=Fit`}
                                            className="absolute inset-0 w-full h-full border-0"
                                            title="Nomination Form Preview"
                                            onLoad={() => setIsNominationLoading(false)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nomination Confirm Checkbox */}
                    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
                        <label className="flex items-center gap-3.5 cursor-pointer group">
                            <div className="relative flex items-center shrink-0">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 shadow-sm hover:border-primary/50"
                                    checked={isNominationConfirmed}
                                    onChange={(e) => setIsNominationConfirmed(e.target.checked)}
                                />
                                <svg className="absolute w-3.5 h-3.5 pointer-events-none hidden peer-checked:block text-white left-0.5 top-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-sm font-medium text-slate-700 select-none leading-relaxed">
                                I have read and agree to the Nomination Form
                            </span>
                        </label>
                    </div>
                </div>
            </CustomerViewLayout>

            {/* Signature Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-5 sm:p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                        <PencilIcon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">Your Signature</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Sign below to confirm your nomination • {signatoryName}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition-colors"
                                    onClick={() => {
                                        sigPadRef.current?.clear();
                                        setSignatureError(null);
                                    }}
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Signature Canvas (Draw only) */}
                            <div className="relative block bg-white">
                                <canvas
                                    ref={canvasRef}
                                    width={480}
                                    height={160}
                                    className="border border-slate-200 rounded-xl w-full bg-white cursor-crosshair h-40 sm:h-48"
                                    style={{ display: 'block', touchAction: 'none' }}
                                />
                                {!padReady && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                                        <span className="text-xs text-slate-400">Loading signature pad...</span>
                                    </div>
                                )}
                            </div>

                            {/* Signature Error */}
                            {signatureError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                                    {signatureError}
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSignatureError(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-primary shadow-md hover:bg-primary/90 transition-colors"
                                    onClick={handleNext}
                                >
                                    Confirm & Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
