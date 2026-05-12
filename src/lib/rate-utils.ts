
/**
 * Calculate the discounted rate based on a percentage.
 * @param rate The original price/rate
 * @param discountPercentage The percentage to discount (e.g. 5 for 5%)
 * @returns The discounted price
 */
export const calculateDiscountedRate = (rate: number, discountPercentage: number): number => {
    if (typeof rate !== 'number' || isNaN(rate)) return 0;
    if (!discountPercentage || isNaN(discountPercentage) || discountPercentage <= 0) return Number(rate.toFixed(4));

    const discountAmount = rate * (discountPercentage / 100);
    return Number((rate - discountAmount).toFixed(4));
};
