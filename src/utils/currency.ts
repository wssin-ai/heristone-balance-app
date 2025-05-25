export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0
    }).format(amount);
};

export const parseCurrency = (str: string): number => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
};