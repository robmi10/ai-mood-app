export const getTimeWeeklyFrameDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const lastSunday = new Date(now.setDate(now.getDate() - dayOfWeek));
    const lastMonday = new Date(now.setDate(lastSunday.getDate() - 7));
    return { start: lastMonday, end: lastSunday };

};

export const getTimeMonthlyFrameDate = () => {
    const now = new Date();
    let months = [];
    for (let month = 0; month < now.getMonth() + 1; month++) {
        const firstDay = new Date(now.getFullYear(), month, 1);
        const lastDay = new Date(now.getFullYear(), month + 1, 0);
        months.push({ start: firstDay, end: lastDay });
    }
    console.log("months ..>", months)
    return months;
};

export const getStartAndEndDate = (period: string) => {
    const now = new Date();
    let start, end;

    if (period === 'MONTHLY') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === 'WEEKLY') {
        start = new Date(now.setDate(now.getDate() - now.getDay() - 7));
        end = new Date(now.setDate(start.getDate() + 7));
    } else {
        throw new Error('Invalid period. Please choose "week" or "month".');
    }

    // Format dates to YYYY-MM-DD
    const format = (date: any) => date.toISOString().split('T')[0];

    return {
        start: format(start),
        end: format(end)
    };
}

