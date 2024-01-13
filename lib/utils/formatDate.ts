export function formatDateWithDay(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'long' });
}

export function getMonthName(monthNumber: number) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleDateString(undefined, { month: 'long' });
}