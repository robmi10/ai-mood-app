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
            })
        )
        .mutation(async (opts) => {
            await db
                .insertInto("moods").values({ userId: opts.input.userId, moodScore: opts.input.moodScore, notes: opts.input.notes }).execute()
        }),
});
