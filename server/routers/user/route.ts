import { db } from "@/utils/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async () => {
    const users = await db
      .selectFrom("users")
      .select(["age", "name"])
      .execute();

    return { users };
  }),
  createUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        age: z.number(),
      })
    )
    .mutation(async (opts) => {
      await db
        .insertInto("users")
        .values({ name: opts.input.name, age: opts.input.age })
        .execute();
    }),
});
