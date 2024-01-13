export function formatPointToMood(mood: number) {
    let moodDescription
    switch (mood) {
        case -2: moodDescription = "Awful"; break;
        case -1: moodDescription = "Bad"; break;
        case 0: moodDescription = "Ok"; break;
        case 1: moodDescription = "Good"; break;
        case 2: moodDescription = "Great"; break;
        default: moodDescription = "undefined mood"; break;
    }
    return moodDescription
}

export function formatMoodToPoint(mood: string) {
    let moodDescription
    switch (mood) {
        case "Awful": moodDescription = -2; break;
        case "Bad": moodDescription = -1; break;
        case "Ok": moodDescription = 0; break;
        case "Good": moodDescription = 1; break;
        case "Great": moodDescription = 2; break;
        default: moodDescription = "undefined mood"; break;
    }
    return moodDescription
}