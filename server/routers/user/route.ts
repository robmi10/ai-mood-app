import { db } from "@/utils/db";
import { publicProcedure, createTRPCRouter, router } from "../../trpc";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        age: z.number(),
      })
    )
    .mutation(async (opts) => {
      await db
        .insertInto("user")
        .values({ name: opts.input.name, age: opts.input.age })
        .executeTakeFirstOrThrow();
    }),
});
