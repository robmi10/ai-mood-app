import { db } from "@/utils/db/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { getEmbedding } from "@/utils/ai/openai";
import { error } from "console";
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
                .executeTakeFirstOrThrow();

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
                        id: Number(latestMoodId.id) + 1,
                        date: new Date()
                    }

                    const embedding = await getEmbedding(moodEntry)
                    await pineconeIndex.upsert([
                        {
                            id: opts.input.userId.toString(),
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
                    ])

                } catch (error) {
                    console.error("Failed to create mood and embedding:", error);
                    throw error
                }
            })
        }),
    getDailyMoodReflectionAndMotivation:
        protectedProcedure.query(async () => {
            const mostCommonMoods = await db.selectFrom('moods')
                .select('moodScore')
                .select('weather')
                .select('activities')
                .select('sleepQuality')
                .select((eb) => eb.fn.countAll().as("occurrences"))
                .groupBy('moodScore')
                .groupBy('weather')
                .groupBy('activities')
                .groupBy('sleepQuality')
                .orderBy('occurrences', 'desc')
                .limit(1)
                .execute();
            return mostCommonMoods
        })
});
