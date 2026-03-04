const fs = require('fs');
const file = 'c:/Vinit/go-sync-v/crm-web/src/pages/rates/RatesPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add handlePriceChange helper
if (!content.includes('handlePriceChange')) {
    const helperCode = `
    const handlePriceChange = (field: string, value: string) => {
        setFormData(prev => {
            const defaultUnitId = measurementUnits.length > 0 ? measurementUnits[0].uid : '';
            const existingUnit = prev.priceUnits?.[field];

            // If a value is entered and no unit is currently selected, set the default unit
            const newPriceUnits = { ...prev.priceUnits };
            if (value && !existingUnit && defaultUnitId) {
                newPriceUnits[field] = defaultUnitId;
            }

            return {
                ...prev,
                [field]: value,
                priceUnits: newPriceUnits
            };
        });
    };
`;
    content = content.replace('    const validateForm = () => {', helperCode + '    const validateForm = () => {');
}

// 2. Modify handleAddRate - specifically remove the default unit loop
content = content.replace(
    /const defaultUnitId = measurementUnits\.length > 0 \? measurementUnits\[0\]\.uid : '';\s*const defaultPriceUnits: Record<string, string> = \{\};\s*if \(defaultUnitId\) \{[\s\S]*?fitVpp = defaultUnitId;\s*\}/,
    '// Units are assigned on-the-fly when values are edited'
);

content = content.replace(/priceUnits: defaultPriceUnits/, 'priceUnits: {}');

// 3. Modify handleEditRate
content = content.replace(
    /const priceUnitsWithDefaults = \{[\s\S]*?fitVpp: existingUnits\.fitVpp \|\| defaultUnitId,\s*\};/,
    `const priceUnitsWithDefaults = { ...existingUnits };
        const priceFields = ['anytime', 'supplyCharge', 'vppOrcharge', 'peak', 'shoulder', 'offPeak', 'cl1Supply', 'cl1Usage', 'cl2Supply', 'cl2Usage', 'demand', 'demandOp', 'demandP', 'demandS', 'fit', 'fitPeak', 'fitCritical', 'fitVpp'];
        
        priceFields.forEach(field => {
            // Apply default unit if the backend gave us a price value without a unit
            let offerField = (offer as any)?.[field];
            if (offerField && !priceUnitsWithDefaults[field] && defaultUnitId) {
                priceUnitsWithDefaults[field] = defaultUnitId;
            }
        });`
);

// 4. Update onChanges
const priceFields = ['anytime', 'supplyCharge', 'vppOrcharge', 'peak', 'shoulder', 'offPeak', 'cl1Supply', 'cl1Usage', 'cl2Supply', 'cl2Usage', 'demand', 'demandOp', 'demandP', 'demandS', 'fit', 'fitPeak', 'fitCritical', 'fitVpp'];

priceFields.forEach(field => {
    const regex = new RegExp('onChange=\\{\\(e\\)\\s*=>\\s*setFormData\\(prev\\s*=>\\s*\\(\\{\\s*\\.\\.\\.prev,\\s*' + field + ':\\s*e\\.target\\.value\\s*\\}\\)\\)\\}', 'g');
    content = content.replace(regex, `onChange={(e) => handlePriceChange('${field}', e.target.value)}`);
});

fs.writeFileSync(file, content);
console.log("Replacements complete");
