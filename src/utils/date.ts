export const formatDate = (date: Date | string): string => {
    if (typeof date === 'string') return date;
    return date.toLocaleDateString('ko-KR').replace(/\./g, '-').replace(/ /g, '').slice(0, -1);
};

export const formatDDay = (dday: number): string => {
    if (dday < 0) return `D+${Math.abs(dday)} (연체)`;
    if (dday === 0) return 'D-Day';
    return `D-${dday}`;
};

export const calculateDDay = (targetDate: string, currentDate: Date): number => {
    const target = new Date(targetDate);
    const diffTime = target.getTime() - currentDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};