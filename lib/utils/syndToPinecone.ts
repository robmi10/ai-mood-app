
const { db } = require("../../utils/db/db"); // Adjust the relative path as needed
const { getEmbedding } = require("../../utils/ai/openai");
const { pineconeIndex } = require("../../utils/db/pinecone");


async function vectorizeAndSyncToPinecone() {
    // Fetch data from your database
    const data = await db.selectFrom("moods").selectAll().execute();


    await Promise.all(data.map(async (entry: any) => {
        const moodEntry = {
            userId: entry.userId,
            moodScore: entry.moodScore,
            activities: entry.activities,
            sleepQuality: entry.sleepQuality,
            notes: entry.notes,
            weather: entry.weather,
            id: entry.id,
            date: new Date()
        }

        const vector = await getEmbedding(moodEntry);

        await pineconeIndex.upsert([
            {
                id: moodEntry.id.toString(),
                values: vector,
                metadata: {
                    userId: moodEntry.userId,
                    date: moodEntry.date.toISOString(),
                    moodScore: moodEntry.moodScore,
                    activities: moodEntry.activities.join(', '),
                    weather: moodEntry.weather,
                    sleepQuality: moodEntry.sleepQuality,
                }
            }
        ])

    }));
}

vectorizeAndSyncToPinecone().then(() => {
    console.log('\nData synchronized with Pinecone......');
}).catch(error => {
    console.error('Error during synchronization:', error);
});
