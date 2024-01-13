export function formatDateWithDay(dateString: string) {
    const date = new Date(dateString);
    console.log("day -> ", date.toLocaleDateString(undefined, { weekday: 'long' }))
    return date.toLocaleDateString(undefined, { weekday: 'long' });
}