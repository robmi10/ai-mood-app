export const getTimeFrameDate = (frame: string) => {
    if (frame === 'WEEKLY') {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const lastSunday = new Date(now.setDate(now.getDate() - dayOfWeek));
        const lastMonday = new Date(now.setDate(lastSunday.getDate() - 6));
        return { start: lastMonday, end: lastSunday };
    }
    else {
        const now = new Date();
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start: firstDayLastMonth, end: lastDayLastMonth };
    }
};
