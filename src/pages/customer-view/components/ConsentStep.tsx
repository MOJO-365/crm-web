import React from 'react';
import { CheckIcon } from '@/components/icons';
import { CustomerViewLayout } from './CustomerViewLayout';

interface ConsentStepProps {
    isChecked: boolean;
    onToggleConsent: (checked: boolean) => void;
    onNext: () => void;
}

export const ConsentStep: React.FC<ConsentStepProps> = ({ isChecked, onToggleConsent, onNext }) => {
    return (
        <CustomerViewLayout
            footerButtonLabel="Next"
            onFooterButtonClick={onNext}
            isFooterButtonDisabled={!isChecked}
        >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="space-y-8">
                    <div className="border-b border-slate-100 pb-6 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Consent & Terms</h1>
                        <p className="text-slate-500">Please review the following information carefully.</p>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Explicit Informed Consent</h2>
                            <p className="text-slate-600 leading-relaxed">
                                I/We provide my/our explicit informed consent for GEE Power and Gas Pty Ltd (GEE Energy) to:
                            </p>
                            <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600">
                                <li>Request my/our historical energy consumption data from the relevant distributor or metering coordinator.</li>
                                <li>Use the information provided in this application to perform a credit check if necessary.</li>
                                <li>Act as my/our energy retailer for the premises listed in this application.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Marketing and Privacy</h2>
                            <p className="text-slate-600 leading-relaxed">
                                GEE Energy respects your privacy. We will only use your personal information in accordance with our Privacy Policy.
                                We may contact you about energy-related products, services, and special offers that may be of interest to you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Standard Retail Contract</h2>
                            <p className="text-slate-600 leading-relaxed">
                                By proceeding, you agree to enter into a Standard Retail Contract with GEE Energy.
                                The terms and conditions of this contract are available on our website or can be provided upon request.
                            </p>
                        </section>

                        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                            <p className="text-emerald-800 text-sm italic">
                                Note: Your consent is required to process this application. You can withdraw your consent at any time by contacting our customer service team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center mt-0.5">
                        <input
                            type="checkbox"
                            className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 hover:border-primary/50"
                            checked={isChecked}
                            onChange={(e) => onToggleConsent(e.target.checked)}
                        />
                        <CheckIcon className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block text-white left-1" />
                    </div>
                    <div className="flex-1">
                        <span className="text-sm md:text-base text-slate-600 group-hover:text-slate-900 transition-colors select-none font-medium">
                            I confirm that I have read and understood the terms above and provide my explicit informed consent to proceed.
                        </span>
                    </div>
                </label>
            </div>
        </CustomerViewLayout>
    );
};
