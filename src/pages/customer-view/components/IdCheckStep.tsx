import React, { useMemo } from 'react';
import { CheckIcon } from '@/components/icons';
import { Input, Select, DatePicker } from '@/components/ui';
import { CustomerViewLayout } from './CustomerViewLayout';

interface IdCheckStepProps {
    idForm: any;
    setIdForm: React.Dispatch<React.SetStateAction<any>>;
    idConfirmed: boolean;
    setIdConfirmed: (confirmed: boolean) => void;
    onBack: () => void;
    onNext: () => void;
    idTypeOptions: any[];
    stateOptions: any[];
    countryOptions: any[];
}

export const IdCheckStep: React.FC<IdCheckStepProps> = ({
    idForm,
    setIdForm,
    idConfirmed,
    setIdConfirmed,
    onBack,
    onNext,
    idTypeOptions,
    stateOptions,
    countryOptions
}) => {
    const idType = Number(idForm.idType);
    const eighteenYearsAgo = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d;
    }, []);

    return (
        <CustomerViewLayout
            title="Finalize Your Enrollment"
            subtitle="Verify your identity"
            onBack={onBack}
            footerButtonLabel="Next"
            onFooterButtonClick={onNext}
            isFooterButtonDisabled={!idConfirmed}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* LEFT COLUMN: FORM */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <DatePicker
                            label="Date of Birth"
                            value={idForm.dob}
                            onChange={(date) => setIdForm((f: any) => ({ ...f, dob: date ? date.toISOString().split('T')[0] : '' }))}
                            maxDate={eighteenYearsAgo}
                        />
                    </div>

                    <Select
                        label="ID Type"
                        options={idTypeOptions}
                        value={idForm.idType}
                        onChange={(val) => setIdForm((f: any) => ({ ...f, idType: String(val) }))}
                    />

                    {/* === DRIVER LICENCE === */}
                    {idType === 0 && (
                        <div className="space-y-4">
                            <Select
                                label="State"
                                options={stateOptions}
                                value={idForm.idstate}
                                onChange={(val) => setIdForm((f: any) => ({ ...f, idstate: String(val) }))}
                            />
                            <Input
                                label="Licence Number"
                                placeholder="Enter licence number"
                                value={idForm.idnumber}
                                onChange={(e) => setIdForm((f: any) => ({ ...f, idnumber: e.target.value }))}
                            />
                            <Input
                                label="Card Number"
                                placeholder="Enter card number"
                                value={idForm.licenseCardNumber}
                                onChange={(e) => setIdForm((f: any) => ({ ...f, licenseCardNumber: e.target.value }))}
                            />
                            <DatePicker
                                label="Expiry Date"
                                value={idForm.idexpiary}
                                onChange={(date) => setIdForm((f: any) => ({ ...f, idexpiary: date ? date.toISOString().split('T')[0] : '' }))}
                            />
                        </div>
                    )}

                    {/* === MEDICARE === */}
                    {idType === 1 && (
                        <div className="space-y-4">
                            <Select
                                label="Card Type"
                                options={[
                                    { value: '0', label: 'Green' },
                                    { value: '1', label: 'Blue' },
                                    { value: '2', label: 'Yellow' },
                                ]}
                                value={idForm.medicareCardType}
                                onChange={(val) => setIdForm((f: any) => ({ ...f, medicareCardType: String(val) }))}
                            />
                            <Input
                                label="Medicare Number"
                                placeholder="Enter medicare number"
                                value={idForm.idnumber}
                                onChange={(e) => setIdForm((f: any) => ({ ...f, idnumber: e.target.value }))}
                            />
                            <Input
                                label="IRN"
                                placeholder="Enter IRN"
                                value={idForm.medicareIrn}
                                onChange={(e) => setIdForm((f: any) => ({ ...f, medicareIrn: e.target.value }))}
                            />
                            <DatePicker
                                label="Expiry Date"
                                value={idForm.idexpiary}
                                onChange={(date) => setIdForm((f: any) => ({ ...f, idexpiary: date ? date.toISOString().split('T')[0] : '' }))}
                            />
                        </div>
                    )}

                    {/* === PASSPORT === */}
                    {idType === 2 && (
                        <div className="space-y-4">
                            <Select
                                label="Country"
                                options={countryOptions}
                                value={idForm.idcountry}
                                onChange={(val) => setIdForm((f: any) => ({ ...f, idcountry: String(val) }))}
                            />
                            <Input
                                label="Passport Number"
                                placeholder="Enter passport number"
                                value={idForm.idnumber}
                                onChange={(e) => setIdForm((f: any) => ({ ...f, idnumber: e.target.value }))}
                            />
                            <DatePicker
                                label="Expiry Date"
                                value={idForm.idexpiary}
                                onChange={(date) => setIdForm((f: any) => ({ ...f, idexpiary: date ? date.toISOString().split('T')[0] : '' }))}
                            />
                        </div>
                    )}

                    {/* Confirmation Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group pt-2">
                        <div className="relative flex items-center mt-0.5">
                            <input
                                type="checkbox"
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 hover:border-primary/50"
                                checked={idConfirmed}
                                onChange={(e) => setIdConfirmed(e.target.checked)}
                            />
                            <CheckIcon className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-snug">
                            I confirm the above details are correct.
                        </span>
                    </label>
                </div>

                {/* RIGHT COLUMN: DOCUMENT GUIDES */}
                <div className="space-y-6">
                    {idType === 0 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Physical Licence</h3>
                                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-w-[260px]">
                                    <img
                                        src={`/Document Images/${(idForm.idstate || 'NSW').toLowerCase()}-licence${['NT', 'SA', 'TAS', 'VIC', 'WA'].includes(idForm.idstate) ? '-front' : idForm.idstate === 'QLD' ? '' : idForm.idstate === 'ACT' ? '' : ''}${idForm.idstate === 'QLD' ? '' : ''}.png`.replace('QLD-licence', 'qld-licenc').replace('TAS-licence', 'tas-licenc').replace('VIC-licence', 'vic-licence')}
                                        alt="Physical Licence Guide"
                                        className="w-full h-auto object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/Document Images/nsw-licence.png';
                                        }}
                                    />
                                </div>
                            </div>

                            {['NSW', 'QLD'].includes(idForm.idstate) && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Digital Licence</h3>
                                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-w-[220px]">
                                        <img
                                            src={`/Document Images/${idForm.idstate.toLowerCase()}-digital-licence${idForm.idstate === 'QLD' ? '-front' : ''}.png`}
                                            alt="Digital Licence Guide"
                                            className="w-full h-auto object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {idType === 2 && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Passport Guide</h3>
                                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-w-[320px]">
                                    <img
                                        src={`/Document Images/ID_Passport_${(idForm.idcountry || '').toLowerCase() === 'australia' ? 'AU' : 'Foreign'}-Front.svg`}
                                        alt="Passport Guide"
                                        className="w-full h-auto object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/Document Images/ID_Passport_AU-Front.svg';
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Ensure the passport number and expiry date match your document exactly.
                            </p>
                        </div>
                    )}

                    {idType === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">Medicare Card Guide</h3>
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-w-[320px]">
                                <img
                                    src={
                                        idForm.medicareCardType === '0' ? '/Document Images/standard-mdicare-card.png' :
                                            idForm.medicareCardType === '1' ? '/Document Images/interim-medicar-card.png' :
                                                '/Document Images/reciprocal-healthcare-card.png'
                                    }
                                    alt="Medicare Card Guide"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Note: Ensure your 10-digit Medicare number and IRN (position on card) are entered correctly.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </CustomerViewLayout>
    );
};
