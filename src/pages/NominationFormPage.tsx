import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_CUSTOMER_BY_CUSTOMER_ID } from '@/graphql/queries/customers';
import { SUBMIT_NOMINATION_FORM } from '@/graphql/mutations/customers';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { CheckIcon, ChevronDownIcon } from '@/components/icons';
import MainLogo from '@/assets/main-logo-dark-1.png';
import { apiAxios } from '@/lib/apollo';

async function loadSignaturePad(): Promise<void> {
    if ((window as any).SignaturePad) return;
    await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/signature_pad@4.1.5/dist/signature_pad.umd.min.js';
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

export const NominationFormPage = () => {
    const [searchParams] = useSearchParams();
    const customerId = searchParams.get('nomination')?.trim();

    const [customerData, setCustomerData] = useState<any>(null);
    const [fetchError, setFetchError] = useState(false);
    const [formSigned, setFormSigned] = useState(false);

    // Signature Modal State
    const [signatoryName, setSignatoryName] = useState('');
    const [mode, setMode] = useState<'pad' | 'type'>('pad');
    const [typed, setTyped] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isNominationExpanded, setIsNominationExpanded] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSignModal, setShowSignModal] = useState(false);
    const [isNominationLoading, setIsNominationLoading] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sigPadRef = useRef<any>(null);

    const [submitNominationForm] = useMutation(SUBMIT_NOMINATION_FORM);

    const [fetchCustomer, { loading: fetchingCustomer }] = useLazyQuery(GET_CUSTOMER_BY_CUSTOMER_ID, {
        variables: { customerId: customerId },
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data.customerByCustomerId) {
                const customer = data.customerByCustomerId;
                setCustomerData(customer);
                setSignatoryName(`${customer.firstName || ''} ${customer.lastName || ''}`.trim());

                // Check if already signed by looking at documents
                const hasNominationForm = customer.documents?.some((doc: any) => doc.type === 'nominationForm');
                if (hasNominationForm) {
                    setFormSigned(true);
                }
            } else {
                setFetchError(true);
            }
        },
        onError: (error) => {
            console.error(error);
            setFetchError(true);
            toast.error('Failed to load nomination form details');
        }
    });

    useEffect(() => {
        if (customerId) {
            fetchCustomer();
        }
    }, [customerId, fetchCustomer]);

    // Initialize Signature Pad
    useEffect(() => {
        let active = true;
        if (!fetchingCustomer && customerData && !formSigned && mode === 'pad' && showSignModal) {
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
                console.error("Failed to load signature pad", err);
            });
        }

        return () => {
            active = false;
            if (sigPadRef.current) {
                if ((sigPadRef.current as any)._resizeHandler) {
                    window.removeEventListener('resize', (sigPadRef.current as any)._resizeHandler);
                }
                sigPadRef.current.off();
                sigPadRef.current = null;
            }
        };
    }, [fetchingCustomer, customerData, formSigned, mode, showSignModal]);

    // Handle Type Mode Rendering
    useEffect(() => {
        if (!fetchingCustomer && customerData && !formSigned && mode === 'type' && canvasRef.current && showSignModal) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            if (canvas.width !== canvas.offsetWidth * ratio) {
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                ctx?.scale(ratio, ratio);
            }

            if (ctx) {
                ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
                if (typed) {
                    let fontSize = 64;
                    ctx.font = `${fontSize}px cursive`;
                    const padding = 40;
                    const maxWidth = (canvas.width / ratio) - padding;
                    while (ctx.measureText(typed).width > maxWidth && fontSize > 16) {
                        fontSize -= 2;
                        ctx.font = `${fontSize}px cursive`;
                    }
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(typed, (canvas.width / ratio) / 2, (canvas.height / ratio) / 2);
                } else {
                    ctx.font = '24px sans-serif';
                    ctx.fillStyle = '#94a3b8';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('Tap here to type your name', (canvas.width / ratio) / 2, (canvas.height / ratio) / 2);
                }
            }
        }
    }, [fetchingCustomer, customerData, formSigned, mode, typed, showSignModal]);

    if (!customerId) {
        return <div className="min-h-screen flex items-center justify-center">Invalid Link</div>;
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-md w-full text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-xl">!</span>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Unable to Load Form</h2>
                    <p className="text-slate-600 mb-6">
                        We couldn't find the details for this form. Please check the link or contact support.
                    </p>
                    <div className="text-sm text-slate-500">
                        Support: 1300 707 042
                    </div>
                </div>
            </div>
        );
    }

    if (fetchingCustomer || !customerData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (formSigned) {
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
                                Your BESS nomination has been received and securely signed.
                            </p>

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
    }

    const handleSave = async () => {
        if (!signatoryName.trim()) {
            setSubmitError('Please enter your name.');
            return;
        }

        if (mode === 'pad' && sigPadRef.current?.isEmpty()) {
            setSubmitError('Please sign in the box above.');
            return;
        }

        if (mode === 'type' && typed.trim().length === 0) {
            setSubmitError('Please type your name.');
            return;
        }

        setShowConfirmModal(true);
    };

    const confirmSubmit = async () => {
        setShowConfirmModal(false);
        setSubmitting(true);
        setSubmitError(null);

        try {
            let signatureBase64: string | null = null;
            const canvas = canvasRef.current;

            if (canvas) {
                const dataUrl = canvas.toDataURL();
                signatureBase64 = extractBase64(dataUrl);
            }

            if (!signatureBase64) {
                throw new Error('Failed to generate signature image');
            }

            const { data } = await submitNominationForm({
                variables: {
                    customerUid: customerData.uid,
                    signatureBase64
                }
            });

            if (data?.submitNominationForm?.success) {
                toast.success('Form signed successfully!');
                setFormSigned(true);
            } else {
                setSubmitError(data?.submitNominationForm?.message || 'Failed to submit form.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('Failed to submit form. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 pb-24">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <img src={MainLogo} alt="GEE Energy" className="h-10 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">BESS Nomination Form</h1>
                    <p className="text-muted-foreground mt-2">Please review your system details and sign below.</p>
                </div>

                <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isNominationExpanded ? 'border-primary/40 ring-4 ring-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                    <button
                        onClick={() => setIsNominationExpanded(!isNominationExpanded)}
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
                                    src={`${apiAxios.defaults.baseURL?.replace(/\/$/, '') || ''}/agreement/nomination-preview/${customerData.uid}?format=pdf#view=Fit`}
                                    className="absolute inset-0 w-full h-full border-0"
                                    title="Nomination Form Preview"
                                    onLoad={() => setIsNominationLoading(false)}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Sticky Bottom Sign Button */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.1)]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Ready to sign?</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Review complete — sign your agreement</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSignModal(true)}
                        className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Sign & Submit
                    </button>
                </div>
            </div>

            {/* Sign Modal */}
            {showSignModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sign Your Agreement</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Complete your BESS nomination</p>
                            </div>
                            <button
                                onClick={() => setShowSignModal(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-6 flex-1">
                            <p className="text-sm text-muted-foreground mb-6">
                                By signing below, I nominate my battery energy storage system (BESS) for participation in the Virtual Power Plant (VPP) program.
                            </p>

                            {submitError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                                    {submitError}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full h-10 px-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={signatoryName}
                                        onChange={(e) => setSignatoryName(e.target.value)}
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="pt-2 border-t border-border mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-foreground">Signature</label>
                                        <div className="flex bg-muted rounded-lg p-1">
                                            <button
                                                type="button"
                                                onClick={() => setMode('pad')}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${mode === 'pad' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                Draw
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMode('type')}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${mode === 'type' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                Type
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        {mode === 'type' && (
                                            <input
                                                type="text"
                                                value={typed}
                                                onChange={(e) => setTyped(e.target.value)}
                                                placeholder="Type your signature here..."
                                                className="absolute inset-x-0 top-2 mx-auto w-3/4 h-10 px-3 text-center border-b border-dashed border-input focus:border-primary focus:outline-none bg-transparent z-10"
                                                style={{ fontStyle: 'italic' }}
                                            />
                                        )}
                                        <div className="border-2 border-dashed border-input rounded-xl bg-card overflow-hidden h-48 flex items-center justify-center cursor-crosshair">
                                            <canvas
                                                ref={canvasRef}
                                                className="w-full h-full"
                                                style={{ touchAction: 'none' }}
                                            />
                                        </div>
                                        {mode === 'pad' && (
                                            <button
                                                type="button"
                                                onClick={() => sigPadRef.current?.clear()}
                                                className="absolute bottom-2 right-2 px-2 py-1 bg-muted/80 hover:bg-muted text-muted-foreground rounded text-xs transition-colors"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 shrink-0 flex gap-3">
                            <button
                                onClick={() => setShowSignModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                onClick={handleSave}
                                disabled={submitting}
                                isLoading={submitting}
                                loadingText="Submitting..."
                                className="flex-1 px-4 !rounded-xl"
                            >
                                Submit Nomination
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Confirm Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-amber-600 dark:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Are you sure?</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                You are about to submit your BESS Nomination Form. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmSubmit}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-primary text-white font-medium hover:bg-slate-800 dark:hover:bg-primary/90 transition-colors shadow-lg shadow-slate-200 dark:shadow-none"
                                >
                                    Yes, Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
