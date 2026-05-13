import React from 'react';
import { CheckIcon } from '@/components/icons';
import { CustomerViewLayout } from './CustomerViewLayout';

interface ConsentStepProps {
    isChecked: boolean;
    onToggleConsent: (checked: boolean) => void;
    onNext: () => void;
    companyName?: string;
}

export const ConsentStep: React.FC<ConsentStepProps> = ({ isChecked, onToggleConsent, onNext, companyName }) => {
    return (
        <CustomerViewLayout
            footerButtonLabel="Next"
            onFooterButtonClick={onNext}
            isFooterButtonDisabled={!isChecked}
        >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="space-y-8">
                    <div className="border-b border-slate-100 pb-6 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Consent & Acknowledgement</h1>
                        <p className="text-slate-500">Please review the following information carefully before proceeding.</p>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Referral Acknowledgement</h2>
                            <p className="text-slate-600 leading-relaxed">
                                I/We acknowledge that we were referred to GEE Energy Pty Ltd (GEE Energy) by the referring <strong className="text-slate-800">{companyName || '{Company Name}'}</strong> for information and participation in the GEE Energy VPP (Virtual Power Plant) Program.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Consent to Contact</h2>
                            <p className="text-slate-600 leading-relaxed">
                                I/We consent to GEE Energy contacting us regarding:
                            </p>
                            <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600">
                                <li>Eligibility assessment for the GEE Energy VPP program.</li>
                                <li>Energy-related products, services, and special offers.</li>
                                <li>Technical assessments, onboarding, and installation coordination where required.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Information Sharing Consent</h2>
                            <p className="text-slate-600 leading-relaxed">
                                I/We authorise the referring company and GEE Energy to share relevant customer and system information necessary for:
                            </p>
                            <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600">
                                <li>Assessing VPP eligibility.</li>
                                <li>Preparing energy plans and offers.</li>
                                <li>Coordinating installation, monitoring, and support services.</li>
                                <li>Managing participation in the GEE Energy VPP program.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Privacy & Data Handling</h2>
                            <p className="text-slate-600 leading-relaxed">
                                GEE Energy will handle all personal information in accordance with its Privacy Policy and applicable Australian privacy laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Important Notice</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Providing consent does not guarantee acceptance into the VPP program. Participation is subject to eligibility requirements and final approval by GEE Energy.
                            </p>
                        </section>
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
                            I confirm that I have read and understood the information above and provide my consent for GEE Energy to contact me and assess my eligibility for the GEE Energy VPP Program.
                        </span>
                    </div>
                </label>
            </div>
        </CustomerViewLayout>
    );
};

