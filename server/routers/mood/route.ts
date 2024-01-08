import { db } from "@/utils/db/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { getEmbedding } from "@/utils/ai/openai";
import { pineconeIndex } from "@/utils/db/pinecone";

export const moodRouter = createTRPCRouter({
    createMood: protectedProcedure
        .input(
            z.object({
                userId: z.number(),
                moodScore: z.number(),
                notes: z.string(),
                activities: z.array(z.string()),
                weather: z.string(),
                sleepQuality: z.string()
            })
        )
        .mutation(async (opts) => {
            const latestMoodId = await db
                .selectFrom("moods")
                .select("id")
                .orderBy("createdAt", "desc") // Replace "createdAt" with your actual timestamp column name
                .limit(1)
                .executeTakeFirst();

            const moodId = latestMoodId ? Number(latestMoodId.id) + 1 : 0

            await db.transaction().execute(async (trx) => {
                try {
                    trx.insertInto("moods").values({
                        userId: opts.input.userId, moodScore: opts.input.moodScore,
                        notes: opts.input.notes, activities: opts.input.activities,
                        weather: opts.input.weather, sleepQuality: opts.input.sleepQuality
                    }).returningAll()
                        .executeTakeFirstOrThrow();

                    const moodEntry = {
                        userId: opts.input.userId,
                        moodScore: opts.input.moodScore,
                        activities: opts.input.activities,
                        sleepQuality: opts.input.sleepQuality,
                        notes: opts.input.notes,
                        weather: opts.input.weather,
                        id: moodId,
                        date: new Date()
                    }
                    const embedding = await getEmbedding(moodEntry)
                    console.log("embedding ->", embedding)
                    await pineconeIndex.upsert([
                        {
                            id: moodId.toString(),
                            values: embedding,
                            metadata: {
                                userId: moodEntry.userId,
                                date: moodEntry.date.toISOString(),
                                moodScore: moodEntry.moodScore,
                                activities: moodEntry.activities.join(', '),
                                weather: moodEntry.weather,
                                sleepQuality: moodEntry.sleepQuality,
                            }
                        }
                    ]).then((res) => console.log("res from pincone ->", res))

                } catch (error) {
                    console.error("Failed to create mood and embedding:", error);
                    throw error
                }
            })
        }),
    getDailyMoodReflectionAndMotivation:
        protectedProcedure.input(z.object({ userId: z.number() })).query(async (opts) => {
            const mostCommonMoods = await db.selectFrom('moods')
                .select('userId')
                .select('moodScore')
                .select('weather')
                .select('activities')
                .select('sleepQuality')
                .select((eb) => eb.fn.countAll().as("occurrences"))
                .groupBy('userId')
                .groupBy('moodScore')
                .groupBy('weather')
                .groupBy('activities')
                .groupBy('sleepQuality')
                .orderBy('occurrences', 'desc')
                .limit(1)
                .execute();
            console.log("mostCommonMoods check ->", mostCommonMoods)

            const embedding = await getEmbedding(mostCommonMoods[0])
            console.log("embedding inside most common->", embedding)
            const vectorMoodFilter = await pineconeIndex.query({ vector: embedding, topK: 4, filter: { userId: opts.input.userId } })
            console.log("vectorMoodFilter ->", vectorMoodFilter)

            const allMoodsFromUser = await db.selectFrom("moods").selectAll().where("userId", '=', opts.input.userId).execute()
            console.log("allMoodsFromUser ->", allMoodsFromUser)

            const pineconeIds = vectorMoodFilter.matches.map(match => match.id);

            console.log("pineconeIds ->", pineconeIds)
            const matchedMoods = allMoodsFromUser.filter(mood => pineconeIds.includes(mood?.id.toString()));

            console.log("matchedMoods ->", matchedMoods)
        })
});
