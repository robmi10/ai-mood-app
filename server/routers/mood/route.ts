import { db } from "@/utils/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";

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
            await db
                .insertInto("moods").values({
                    userId: opts.input.userId, moodScore: opts.input.moodScore,
                    notes: opts.input.notes, activities: opts.input.activities,
                    weather: opts.input.weather, sleepQuality: opts.input.sleepQuality
                }).execute()
        }),
});
