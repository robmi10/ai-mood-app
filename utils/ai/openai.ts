import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw Error("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({ apiKey });

export default openai;

export async function getEmbedding(moodEntry: any) {
    console.log("inside getEmbedding", moodEntry)
    const text = `Mood Score: ${moodEntry.moodScore}. ` +
        `Notes: ${moodEntry?.notes}. ` +
        `Activities: ${moodEntry.activities.join(', ')}. ` +
        `Weather: ${moodEntry.weather}. ` +
        `Sleep Quality: ${moodEntry.sleepQuality}.`;

    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });
    const embedding = response.data[0].embedding;

    if (!embedding) throw new Error("No embedding generated.");
    return embedding;
}