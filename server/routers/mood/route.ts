import { db } from "@/utils/db/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { getEmbedding } from "@/utils/ai/openai";
import { error } from "console";

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
            console.log("latestMoodId ->", latestMoodId)

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

            console.log("latestMoodId ->", latestMoodId)
            console.log("moodEntry ->", moodEntry)
            const embedding = await getEmbedding(moodEntry)

            console.log("embedding ->", embedding)
            if (2 > 1) throw error('Failed to embed the data.')

            await db
                .insertInto("moods").values({
                    userId: opts.input.userId, moodScore: opts.input.moodScore,
                    notes: opts.input.notes, activities: opts.input.activities,
                    weather: opts.input.weather, sleepQuality: opts.input.sleepQuality
                }).execute()
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
